import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { SetSshKeyDto } from './dto/set-sshkey.dto';
import { SshKeysService } from './sshkeys.service';
import { AdminOnly } from 'src/auth/decorators/adminonly.decorator';

@Controller('sshkeys')
export class SshKeysController {
    constructor(
        private sshkeysService: SshKeysService
    ) {}

    // POST /sshkeys/my
    // This action adds a key ${setSshDto} to a user's keys
    @Post('my')
    async setSshKey(@Body() setSshDto: SetSshKeyDto, @Req() req: Request) {
        try {
            if (!await this.sshkeysService.setSshKey(setSshDto, req['user']?.username)) {
                return new HttpException("Unable to add this ssh key. Please verify the key and name.", HttpStatus.BAD_REQUEST);
            }
            return "SSH key was successfully created."
        } catch(err) {
            throw new HttpException("SSH key could not be added to this account.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE /sshkeys/:username
    // This action removes a key ${setSshDto} to a user's keys
    @Delete(':username/:uuid')
    async deleteSshKey(@Param('uuid') uuidSshKey: string, @Param('username') username: string, @Req() req: Request) {
        try {
            if (username !== req['user']?.username) {
                throw new HttpException("You can only delete ssh keys that belong to you.", HttpStatus.UNAUTHORIZED)
            }
            if(!await this.sshkeysService.removeSshKey(uuidSshKey, username)) {
                throw new HttpException("User or key not found.", HttpStatus.INTERNAL_SERVER_ERROR)
            }
        } catch(err) {
            throw new HttpException("SSH key could not be removed.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return "SSH key has successfully been removed."
    }


    // GET /sshkeys/my
    // This action gets all the ssh keys of the user
    @Get('my')
    async getSshKeys(@Req() req: Request) {
        try {
            return await this.sshkeysService.getSshKeysOfUser(req['user'].username);
        } catch(err) {
            throw new HttpException("SSH keys could not be retrieved.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // GET /sshkeys/
    // This action gets all ssh keys
    @AdminOnly()
    @Get()
    async getAllSshKeys(@Req() req: Request) {
        try {
            return await this.sshkeysService.getAllSshKeys();
        } catch(err) {
            throw new HttpException("SSH keys could not be retrieved.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
