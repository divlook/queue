import type { Config } from '@jest/types'

/**
 * https://jestjs.io/docs/configuration
 */
const config: Config.InitialOptions = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^~/(.*)$': '<rootDir>/$1',
    },
}

export default config
