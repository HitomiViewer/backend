import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Document')
    .setDescription('REST API document')
    .setVersion('2023.05.14')
    .addTag('REST')
    .addBearerAuth()
    .addCookieAuth('Refresh')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);
}
