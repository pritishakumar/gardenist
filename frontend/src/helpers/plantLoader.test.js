// const { plantLoader } = require("./plantLoader");

// import axios from 'axios';
// jest.mock('axios');

// describe('plantLoader functionality', function() {
// 	test('plantLoader works', async function() {
// 		const axiosResp = { data: 'correct data' };
// 		const plantId = 3;

// 		axios.get.mockResolvedValue(axiosResp);
// 		const result = await plantLoader(plantId);

// 		expect(result).toBe('correct data');
// 	});
// 	test('plantLoader Error - not integer', async function() {
// 		const axiosResp = { data: 'correct data' };
// 		const plantId = 'abc';

// 		axios.get.mockResolvedValue(axiosResp);
// 		const result = await plantLoader(plantId);

// 		expect(result).toBe(null);
// 	});
// });
