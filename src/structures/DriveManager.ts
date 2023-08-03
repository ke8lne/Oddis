import { drive_v3 } from "googleapis";
import fs from 'fs';
import Parser from "./ConfigParser";

export default class DriveManager {
    constructor(public client: drive_v3.Drive, public configManager: Parser) {
        return this;
    }

    async list(parent: string, folderOnly = false) {
        let _ = await this.client.files.list({
            q: `${typeof parent === "string" ? `'${parent}' in parents ` : ''}${folderOnly ? `mimeType='application/vnd.google-apps.folder'` : ''}`,
            fields: `nextPageToken, files(id, name)`,
            spaces: "drive",
        });
        return _.data.files;
    }

    async upload(name: string, type: string, path?: string, parent?: string) {
        if (typeof path === "string" && !fs.existsSync(path)) throw new Error(`${path} path specified does not exists.`);
        let b = {
            requestBody: {
                name,
                mimeType: typeof path === "string" ? type : 'application/vnd.google-apps.folder',
            },
            fields: "files(id, name)"
        };
        if (typeof path === "string") b["media"] = { body: fs.createReadStream(path), mimeType: type };
        if (typeof parent === "string") b["requestBody"]["parents"] = [parent];
        return await this.client.files.create({ ...b });
    }

    async setDriveParentId(idOrDrive: string | drive_v3.Drive, name?: string) {
        if (typeof idOrDrive === "string") {
            this.configManager.contents.currentDriveParentId = idOrDrive;
            this.configManager.saveConfig();
            return this.configManager.contents;
        }
        else if (idOrDrive instanceof drive_v3.Drive && typeof name === "string") {
            let res = await idOrDrive.files.list({
                q: "mimeType='application/vnd.google-apps.folder'",
                fields: `nextPageToken, files(id, name)`,
                spaces: "drive",
            });
            // GUI prompt but have to choose the first result for now.
            let _pick = res.data.files?.find(_ => _.name === name)?.name;
            if (!_pick) throw new Error(`Cannot find ${name} in the drive.`);
            this.configManager.contents.currentDriveParentId = _pick;
            this.configManager.saveConfig();
            return this.configManager.contents;
        };
        throw new Error("Invalid ID.");
    }
}