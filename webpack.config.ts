import path from 'path'
import webpack from 'webpack'
import tsTransformPaths from '@zerollup/ts-transform-paths'

const ctx = getContext()

const config: webpack.Configuration = {
    mode: ctx.NODE_ENV,
    entry: {
        queue: {
            import: dir('src/queue.ts'),
            library: {
                type: 'umd',
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
                            getCustomTransformers: (program) => {
                                const transformer = tsTransformPaths(program)

                                return {
                                    before: [transformer.before],
                                    afterDeclarations: [
                                        transformer.afterDeclarations,
                                    ],
                                }
                            },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
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
