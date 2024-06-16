import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Realizar una solicitud POST para obtener el token JWT
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'Admin123456', password: 'HF$123456' });

    authToken = loginResponse.body.acces_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) should return an array of users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users (GET) should return an array of users', async () => {
    const invalidToken = 'token_invalido'; // Token JWT inválido para simular el escenario

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/users/:id (GET) should return a user by id', async () => {
    const userId = 1;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  it('/users (POST) should create a new user', async () => {
    const newUser = {
      username: generateRandomUsername(),
      password: 'Password$12345',
      roles: ['ADMIN'],
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username);
  });
});

function generateRandomUsername(length: number = 8): string {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let username = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    username += characters.charAt(randomIndex);
  }

  return username;
}
