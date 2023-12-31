import { SanitizedUser } from './types/sanitized-user.type';
import { BadRequestException, Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminOnly } from 'src/decorators/adminonly.decorator';
import { ApiBearerAuth, ApiCookieAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/user.decorator';
import { RequestUser } from 'src/auth/types/jwt-user-data.type';
import { ApiStandardResponse } from 'src/interfaces/standard-response.inteface';
import { CompliantContentResponse, MessageResponse } from 'src/types/standard-response.type';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('users')
@ApiResponse({ type: ApiStandardResponse })
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users
  // This action returns all users
  @AdminOnly()
  @ApiOkResponse({ type: ApiStandardResponse })
  @Get()
  async findAll(): Promise<CompliantContentResponse<SanitizedUser[]>> {
    return await this.usersService.findAll();
  }

  // GET /users/my
  // This action returns a user's profile
  @ApiOkResponse({ type: ApiStandardResponse })
  @Get('my')
  async getProfile(@GetUser() user: RequestUser): Promise<CompliantContentResponse<SanitizedUser>> {
    return await this.usersService.findOne({ id: user.id });
  }

  // GET /users/:username
  // This action returns a #${username} user
  @ApiOkResponse({ type: ApiStandardResponse })
  @AdminOnly()
  @Get(':username')
  async findOne(@Param('username') username: string): Promise<CompliantContentResponse<SanitizedUser>> {
    return await this.usersService.findOne({ username });
  }

  // DELETE /users/:username
  // This action deletes a #${username} user
  @AdminOnly()
  @ApiOkResponse({ type: ApiStandardResponse })
  @Delete(':username')
  async delete(@Param('username') username: string): Promise<MessageResponse> {
    try {
      await this.usersService.delete({ username });
    } catch (err) {
      throw new BadRequestException('User deletion failed');
    }
    return 'User deleted successfully';
  }
}
