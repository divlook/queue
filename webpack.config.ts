import path from 'path'
import webpack from 'webpack'

const ctx = getContext()

const config: webpack.Configuration = {
    mode: ctx.NODE_ENV,
    entry: {
        'queue.browser': {
            import: dir('src/queue.ts'),
            library: {
                type: 'window',
                name: 'Queue',
                export: 'default',
            },
        },
        'queue.cjs': {
            import: dir('src/queue.ts'),
            library: {
                type: 'commonjs',
            },
        },
        'queue.esm': {
            import: dir('src/queue.ts'),
            library: {
                type: 'module',
            },
        },
    },
    output: {
        filename: '[name].js',
        path: dir('dist'),
        clean: true,
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            '@': dir('src/'),
            '~': dir(),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: ctx.TS_CONFIG_PATH,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    experiments: {
        outputModule: true,
    },
}

export default config

function getContext() {
    const ROOT_DIR = path.resolve(__dirname)
    const NODE_ENV = (process.env.NODE_ENV ?? 'development') as
        | 'development'
        | 'production'
    const TS_CONFIG_PATH = path.join(ROOT_DIR, 'tsconfig.build.json')

    return {
        ROOT_DIR,
        NODE_ENV,
        TS_CONFIG_PATH,
    }
}

function dir(...paths: string[]) {
    return path.join(ctx.ROOT_DIR, ...paths)
}
