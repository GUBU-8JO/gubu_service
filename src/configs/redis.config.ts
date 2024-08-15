// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [ConfigModule],
//   useFactory: async (configService: ConfigService) => {
//     const url = `redis://:${configService.get('REDIS_PASSWORD')}@${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}/0`;
//     return {
//       type: 'single',
//       // url: configService.get('REDIS_HOST'),
//       url,
//     };
//   },
//   inject: [ConfigService],
// })
// export class AppModule {}
