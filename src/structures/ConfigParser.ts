import ConfigContents from '../@types/ConfigContents';
import fileDialog from 'node-file-dialog';
import fs from 'fs';

export default class Parser {
    contents: ConfigContents;

    constructor(public filePath?: string, checkExists = false) {
        if ((typeof filePath === "string" && checkExists) && !fs.existsSync(filePath)) throw new Error(this.contents.debug ? "err404" : `Configuration file doesn't exists.`);
        let content = typeof filePath === "string" && fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ConfigContents : undefined;
        this.contents = {
            currentDriveParentId: content ? content.currentDriveParentId : undefined,
            currentLocalGameDirectory: content ? content.currentLocalGameDirectory : undefined,
            credentialsFilePath: content ? content.credentialsFilePath : undefined,
            tokensFilePath: content ? content.tokensFilePath : undefined,
            debug: content ? content.debug : false,
            scopes: content ? content.scopes : []
        } as ConfigContents;
        if (typeof this.contents.currentLocalGameDirectory === "string" && !fs.existsSync(this.contents.currentLocalGameDirectory))
            throw new Error(`'${this.contents.currentLocalGameDirectory}' doesn't exists.`);
        if (typeof this.contents.credentialsFilePath === "string" && !fs.existsSync(this.contents.credentialsFilePath))
            throw new Error(`'${this.contents.credentialsFilePath}' doesn't exists.`);
        if (typeof this.contents.tokensFilePath === "string" && !fs.existsSync(this.contents.tokensFilePath))
            throw new Error(`'${this.contents.tokensFilePath}' doesn't exists.`);
        return this;
    }

    saveConfig() {
        if (typeof this.filePath === "string") {
            fs.writeFileSync(this.filePath, JSON.stringify(this.contents));
            return true;
        }
        return false;
    }

    async setLocalGameDirectory(dir?: string) {
        if (typeof (dir) === "string" && !fs.existsSync(dir)) throw new Error(`'${dir}' is not a directory.`);
        let path = await fileDialog({ type: "directory" });
        if (!fs.existsSync(path[0])) throw new Error(`${path[0]} doesn't exists.`);
        this.contents.currentLocalGameDirectory = path[0];
        this.saveConfig();
        return path[0];
    }

    async setCredentialsPath(path?: string) {
        if (typeof path === "string" && !fs.existsSync(path)) throw new Error(`'${path}' doesn't exists`);
        let _path = await fileDialog({ type: "open-file" });
        if (!fs.existsSync(_path[0])) throw new Error(this.contents.debug ? "fileErr404" : `${_path[0]} doesn't exists.`);
        this.contents.credentialsFilePath = _path[0];
        this.saveConfig();
        return _path[0];
    }

    async setTokensPath(path?: string) {
        if (typeof path === "string" && !fs.existsSync(path)) throw new Error(`'${path}' doesn't exists`);
        let _path = await fileDialog({ type: "open-file" });
        if (!fs.existsSync(_path[0])) throw new Error(`'${_path[0]}' doesn't exists.`);
        this.contents.tokensFilePath = _path[0];
        this.saveConfig();
        return _path[0];
    }
}