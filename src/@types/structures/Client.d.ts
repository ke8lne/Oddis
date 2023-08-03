import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { OAuth2Client } from 'google-auth-library';
import DriveManager from './DriveManager';
import Parser from './ConfigParser';
import Credentials from '../@types/Credentials';
export default class Client {
    _client: OAuth2Client | JSONClient;
    drive: DriveManager;
    credentials: Credentials;
    configManager: Parser;
    constructor(configPath: string, checkIfConfigExists?: boolean);
    private parseCredentials;
    login(): Promise<this>;
}
