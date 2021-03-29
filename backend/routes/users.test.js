'use strict';

const request = require('supertest');

const db = require('../db.js');
const app = require('../app');
const User = require('../models/user');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjE2NDUwMDc3fQ.11KGzWWRbzah6Sxgu_oHihgiEDBG7tTuErWL5sAF3xg";

beforeAll(async function() {
	await db.query(`DELETE FROM users`);
	await db.query(
		`INSERT INTO users (email, name, password)
        VALUES ('test@test.com',
                'Test User',
                '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q'),
            ('test1@test.com',
                'Test User1',
                'not password')`
	);
});
beforeEach(async function() {
	await db.query(`BEGIN`);
});
afterEach(async function() {
	await db.query('ROLLBACK');
});
afterAll(async function() {
	await db.end();
});

/* POST /api/user/register *******************  */
describe('POST /api/user/register', function() {
    const email = 'test7@test.com';
    const emailExisting = 'test1@test.com';
    const name = 'Test User7';
    const password = 'password'

	test('register works', async function() {
		const resp = await request(app).post('/api/user/register').send({
			email, name, password
		});
		// expect(resp.statusCode).toEqual(201);
		expect(resp.body).toEqual({
			user: {email, name},
			token: expect.any(String)
		});
	});

	test('register error, duplicate email', async function() {
        try {
            const resp = await request(app)
			.post('/api/user')
			.send({
				email: emailExisting, name, password
			})
        } catch (err) {
            expect(err).toEqual(new BadRequestError(`Duplicate email: ${emailExisting}`));
        };
	});
});


/* POST /api/user/login *******************  */
describe('POST /api/user/login', function() {
    const email = 'test@test.com';
    const name = 'Test User';
    const emailWrong = 'test3@test.com';
    const password = 'password'
    const passwordWrong = 'password!!'

	test('register works', async function() {
		const resp = await request(app).post('/api/user/login').send({
			email, password
		});
		expect(resp.statusCode).toEqual(200);
		expect(resp.body).toEqual({
			user: {email, name},
			token: expect.any(String),
            lists: {}
		});
	});
	test('register error, wrong email', async function() {
        try {
            const resp = await request(app)
			.post('/api/user/login')
			.send({
				email: emailWrong, password
			})
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        };
	});
    test('register error, wrong password', async function() {
        try {
            const resp = await request(app)
			.post('/api/user/login')
			.send({
				email, password: passwordWrong
			})
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        };
	});
});


/* PATCH /api/user/edit *******************  */
describe('PATCH /api/user/edit', () => {
    const email = 'test@test.com';
    const nameNew = 'Test User!!';
    const password = 'password';
    const passwordWrong = 'password-wrong'
    const passwordNew = 'password!!'

	test('edit works', async function() {
        const formData = {
            name: nameNew,
            password: passwordNew
        }
		const resp = await request(app)
			.patch(`/api/user/edit`)
			.send({
				email, password, formData
			})
			.set('authorization', `Bearer ${token}`);
		expect(resp.body).toEqual({
			user: {
                email, 
                name: nameNew},
			token: expect.any(String)
		});
	});
    test('edit Error, wrong password', async function() {
        try {
            const formData = {
                name: nameNew,
                password: passwordNew
            }
            const resp = await request(app)
                .patch(`/api/user/edit`)
                .send({
                    email,
                    password: passwordWrong, 
                    formData
                })
                .set('authorization', `Bearer ${token}`);
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
	});
    test('edit Error, no token', async function() {
        try {
            const formData = {
                name: nameNew
            }
            const resp = await request(app)
                .patch(`/api/user/edit`)
                .send({
                    email, password, formData
                })
        } catch (err) {
            expect(err).toEqual(new BadRequestError(`Duplicate email: `));
        }
	});
});

/* DELETE /api/user/delete *******************  */
describe('DELETE /api/user/delete', function() {
	const email = 'test@test.com';
    const emailExisting = 'test1@test.com';
    const password = 'password';
    const passwordWrong = 'password-wrong'

	test('delete works', async function() {
		const resp = await request(app)
			.delete(`/api/user/delete`)
			.send({
				email, password
			})
			.set('authorization', `Bearer ${token}`);
		expect(resp.body).toEqual({
			deleted: email
		});
	});
    test('delete user Error, unauthorized email', async function() {
        try {
            const resp = await request(app)
			.delete(`/api/user/${emailExisting}`)
			.send({
				password
			})
			.set('authorization', `Bearer ${token}`);
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
	});
    test('delete user Error, wrong password', async function() {
        try {
            const resp = await request(app)
			.delete(`/api/user/${email}`)
			.send({
				password: passwordWrong
			})
			.set('authorization', `Bearer ${token}`);
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
	});
    test('delete user Error, no token', async function() {
        try {
            const resp = await request(app)
			.delete(`/api/user/${email}`)
			.send({
				password
			})
        } catch (err) {
            expect(err).toEqual(new UnauthorizedError(`Invalid email/password`));
        }
	});
});