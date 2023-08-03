import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs';
import DriveManager from './DriveManager';
import Parser from './ConfigParser';
import Credentials from '../@types/Credentials';

export default class Client {
    _client: OAuth2Client | JSONClient;
    drive: DriveManager;
    credentials: Credentials;
    configManager: Parser;

    constructor(configPath: string, checkIfConfigExists = false) {
        this.configManager = new Parser(configPath, checkIfConfigExists);
        return this;
    }

    private async parseCredentials() {
        if (!fs.existsSync(this.configManager.contents.credentialsFilePath)) throw new Error(`${this.configManager.contents.credentialsFilePath} doens't contain any credentials or doesn't exists.`);
        this.credentials = JSON.parse(fs.readFileSync(this.configManager.contents.credentialsFilePath, "utf-8"));
        return this.credentials;
    }

    async login() {
        await this.parseCredentials();
        try {
            this._client = google.auth.fromJSON(this.credentials as any);
        } catch (_) { };
        if (this._client) return this;
        this._client = await authenticate({ scopes: this.configManager.contents.scopes, keyfilePath: this.configManager.contents.credentialsFilePath });
        if (this._client.credentials) {
            let key = this.credentials.installed || this.credentials.web;
            fs.writeFileSync(this.configManager.contents.tokensFilePath, JSON.stringify({
                type: "authorized_user",
                client_id: key.client_id,
                client_secret: key.client_secret,
                refresh_token: this._client.credentials.refresh_token
            }));
        };
        // Creating Drive Client
        this.drive = new DriveManager(google.drive({ version: "v3", auth: this._client }), this.configManager);
        return this;
    }
}