import ConfigContents from '../@types/ConfigContents';
export default class Parser {
    filePath?: string | undefined;
    contents: ConfigContents;
    constructor(filePath?: string | undefined, checkExists?: boolean);
    saveConfig(): boolean;
    setLocalGameDirectory(dir?: string): Promise<any>;
    setCredentialsPath(path?: string): Promise<any>;
    setTokensPath(path?: string): Promise<any>;
}
