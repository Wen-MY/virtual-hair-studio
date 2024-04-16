const request = require('supertest');
const app = require('../../index.js');
const agentCredentials = require('../data/agent.json');

describe('Salon API Routes', () => {
    let clientAgent; // Supertest agent for client user
    let adminAgent; // Supertest agent for admin user

    beforeAll((done) => {
        // Create a Supertest agent for client user
        clientAgent = request.agent(app);
        clientAgent
            .post('/sign-in')
            .send(agentCredentials.client)
            .expect(200, () => {
                // Create a Supertest agent for admin user
                adminAgent = request.agent(app);
                adminAgent
                    .post('/sign-in')
                    .send(agentCredentials.admin)
                    .expect(200, done);
            });
    });

    afterAll((done) => {
        clientAgent
            .get('/logout')
            .expect(200, () => {
                adminAgent
                    .get('/logout')
                    .expect(200, done);
            });
    });

    it('should retrieve salon ID for the current user', async () => {
        await agent
            .get('/salon/id')
            .expect(200);
    });

    it('should retrieve salons with pagination', async () => {
        await agent
            .get('/salon/retrieve')
            .expect(200);
    });

    it('should retrieve salon details by ID', async () => {
        await agent
            .get('/salon/get/1') // Assuming salon ID 1 exists
            .expect(200);
    });

    it('should update salon information', async () => {
        await agent
            .put('/salon/update/1') // Assuming salon ID 1 exists and belongs to the user
            .send({ name: 'New Salon Name', address: 'New Address', state: 'New State', contact_number: 'New Contact Number', business_hour: 'New Business Hour' })
            .expect(200);
    });

    it('should create a new salon', async () => {
        await agent
            .post('/salon/create')
            .send({ name: 'New Salon' })
            .expect(201);
    });

    it('should update salon image', async () => {
        // Assuming a valid file is provided in the test directory
        await agent
            .post('/salon/update-salon-image')
            .attach('salonImage', 'path/to/valid/image.jpg')
            .expect(200);
    });
});
