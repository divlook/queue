import path from 'path'
import webpack from 'webpack'

const ctx = getContext()

const config: webpack.Configuration = {
    mode: ctx.NODE_ENV,
    entry: {
        queue: {
            import: dir('src/queue.ts'),
            library: {
                type: 'umd',
                name: 'Queue',
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
                use: ['babel-loader', 'ts-loader'],
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

    return {
        ROOT_DIR,
        NODE_ENV,
    }
}

function dir(...paths: string[]) {
    return path.join(ctx.ROOT_DIR, ...paths)
}
