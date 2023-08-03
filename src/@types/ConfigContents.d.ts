export default interface ConfigContents {
    currentDriveParentId: string;
    currentLocalGameDirectory: string;
    credentialsFilePath: string;
    tokensFilePath: string;
    debug: boolean;
    scopes: string[]
}