import fs from "fs"
import { sleep } from '../../../../test/config';
const { google } = require('googleapis');

const credentials = require('../config/credentials.json')

const TOKEN_PATH = require('../config/token.json')


export class DownloadGoogleDriveAPI{

  public async Download(fileid: string, dest: string): Promise<boolean>{

    const destino = fs.createWriteStream(dest)
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.credentials = TOKEN_PATH

    await this.DownloadImageAuth(fileid, destino, oAuth2Client)

    await sleep(500)
    console.log('to esperando')

    return this.verificaBaixou(destino)
    
  }

  private async DownloadImageAuth(fileId: string, destinofs: fs.WriteStream, auth: any): Promise<void>{
    const drive = google.drive({version: 'v3', auth});

    await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
      ).then((res, err) => {
        if(err) {
          console.log('meu erro')
          console.error(err)
        }
        res.data
          .on('end', () => {
            
          })
          .on('error', () => {})
          .on('data', () => {
          })
          .pipe(destinofs)
      })
  }

  private verificaBaixou(destinofs: fs.WriteStream): boolean {
    
    if(fs.readFileSync(destinofs.path).length > 0) {
      return true
    } 
    fs.unlinkSync(destinofs.path)
    return false
  }

}
