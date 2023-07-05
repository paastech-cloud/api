import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { SetSshDto } from './dto/set-ssh.dto';
import { SshService } from './ssh.service';

@Controller('ssh')
export class SshController {
    constructor(
        private sshService: SshService
    ) {}

    // PATCH /users/:username/ssh
    // This action adds a key ${setSshDto} to a user's keys
    @Post(':username')
    async setSshKey(@Body() setSshDto: SetSshDto, @Req() req: Request) {
        try {
            return await this.sshService.setSshKey(setSshDto, req['user']?.username);
        } catch(err) {
            throw new HttpException("SSH key could not be added to this account.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE /users/:username/ssh
    // This action removes a key ${setSshDto} to a user's keys
    @Delete(':username')
    async deleteSshKey(@Body() setSshDto: SetSshDto, @Req() req: Request) {
        // TODO: implement correctly
        try {
            if(!await this.sshService.removeSshKey(setSshDto, req['user']?.username)) {
                throw new HttpException("User or key not found.", HttpStatus.INTERNAL_SERVER_ERROR)
            }
        } catch(err) {
            throw new HttpException("SSH key could not be removed.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return "SSH key has successfully been removed."
    }


    // GET /users/:username/ssh
    // This action gets all the ssh keys of the user
    @Get(':username')
    async getSshKeys(@Req() req: Request) {
        try {
            return await this.sshService.getAllSshKeys(req['user']?.username);
        } catch(err) {
            console.log(err)
            throw new HttpException("SSH keys could not be retrieved.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
