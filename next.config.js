/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Solo per il client, escludiamo i moduli problematici
    if (!isServer) {
      // Aggiungi mysql2 alla lista di moduli esterni
      config.externals = [...(config.externals || []), "mysql2", "mysql"];

      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Moduli Node.js nativi che non dovrebbero essere bundlati lato client
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        assert: false,
        events: false,
        url: false,
        querystring: false,
        buffer: false,
        string_decoder: false,
        timers: false,
        constants: false,
        punycode: false,
        process: false,
        child_process: false,
      };
    }

    return config;
  },
  // Assicurati che mysql2 venga traspilato correttamente
  transpilePackages: ["mysql2"],
};

module.exports = nextConfig;
