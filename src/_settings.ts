/** @format */

// import * as dotenv from 'dotenv/config'
// const dotenv = require('dotenv').config();
import * as dotenv from 'dotenv';
const config = dotenv.config();

// console.log('DEBUG:', process.env.DEBUG);
// console.log('NODE_ENV:', process.env.NODE_ENV);

const PRODUCTION_STR = 'production';
export const PRODUCTION = process.env.NODE_ENV === PRODUCTION_STR;

export const PROJECT_DIR = __dirname;

export const packageJson = require('../package.json');
