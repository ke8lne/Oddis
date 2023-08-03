import { drive_v3 } from "googleapis";
import Parser from "./ConfigParser";
export default class DriveManager {
    client: drive_v3.Drive;
    configManager: Parser;
    constructor(client: drive_v3.Drive, configManager: Parser);
    list(parent: string, folderOnly?: boolean): Promise<drive_v3.Schema$File[] | undefined>;
    upload(name: string, type: string, path?: string, parent?: string): Promise<import("gaxios").GaxiosResponse<drive_v3.Schema$File>>;
    setDriveParentId(idOrDrive: string | drive_v3.Drive, name?: string): Promise<import("../@types/ConfigContents").default>;
}
