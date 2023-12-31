import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { SshKeysService } from './sshkeys.service';
import { AdminOnly } from 'src/decorators/adminonly.decorator';
import { CreateSshKeyDto } from './dto/create-sshkey.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { RequestUser } from 'src/auth/types/jwt-user-data.type';
import { ApiBearerAuth, ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiStandardResponse } from 'src/interfaces/standard-response.inteface';
import { CompliantContentResponse, MessageResponse } from 'src/types/standard-response.type';
import { SanitizedSshKey } from './types/sanitized-ssh-key';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('ssh keys')
@ApiResponse({ type: ApiStandardResponse })
@Controller('sshkeys')
export class SshKeysController {
  constructor(private sshkeysService: SshKeysService) {}

  // POST /sshkeys/my
  // This action adds a key ${setSshDto} to a user's keys
  @ApiCreatedResponse({ type: ApiStandardResponse })
  @Post('my')
  async createSshKey(@Body() createSshDto: CreateSshKeyDto, @GetUser() user: RequestUser): Promise<MessageResponse> {
    if (!(await this.sshkeysService.createSshKey(user.id, createSshDto))) {
      throw new HttpException('Unable to add this ssh key. Please verify the key and name.', HttpStatus.BAD_REQUEST);
    }
    return {
      status: 'created',
      message: 'SSH key has successfully been created.',
    };
  }

  // DELETE /sshkeys/:username
  // This action removes a key ${setSshDto} to a user's keys
  @ApiOkResponse({ type: ApiStandardResponse })
  @Delete('my/:uuid')
  async deleteSshKey(@Param('uuid', new ParseUUIDPipe()) uuidSshKey: string, @GetUser() user: RequestUser): Promise<MessageResponse> {
    if (!(await this.sshkeysService.removeSshKey(user.id, uuidSshKey))) {
      throw new HttpException('No ssh key with these specifications could be found.', HttpStatus.BAD_REQUEST);
    }
    return {
      status: 'removed',
      message: 'SSH key has successfully been deleted.',
    };
  }

  // GET /sshkeys/my
  // This action gets all the ssh keys of the user
  @ApiOkResponse({ type: ApiStandardResponse })
  @Get('my')
  async getSshKeys(@GetUser() user: RequestUser): Promise<CompliantContentResponse<SanitizedSshKey[]>> {
    return await this.sshkeysService.getSshKeysOfUser(user.id);
  }

  // GET /sshkeys/
  // This action gets all ssh keys
  @ApiOkResponse({ type: ApiStandardResponse })
  @AdminOnly()
  @Get()
  async getAllSshKeys(): Promise<CompliantContentResponse<SanitizedSshKey[]>> {
    return await this.sshkeysService.getAllSshKeys();
  }
}
