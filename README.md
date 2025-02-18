# 🌟 Soroswap Frontend @ Soroban Preview 10🌟

Welcome to Soroswap, a decentralized exchange (DEX) that draws inspiration from the Uniswap V2 protocol and is specifically tailored for the Soroban network.

Before you begin, ensure you have met the following requirements:

- docker >= v24.0.2
- **Freighter Wallet v5.6.3** Please use this version. You can have an intependent environment following the instructios in [this post](https://discord.com/channels/897514728459468821/1135655444157833256/1135655444157833256)

## 🛠 Setting Up Soroswap 🛠

1. Clone the Repository

```bash

git clone https://github.com/soroswap/frontend.git
cd frontend
```

2. Set Up Environment Variables

Copy the .env.example file to create a new .env file:

```bash
cp .env.local.example .env
```

Now, edit the `.env` file and provide the `NEXT_PUBLIC_BACKEND_URL` variable.
This will tell the frontend where to look for:

- the list of known tokens
- the SoroswapFactory address
- the tokens admin's private key (in order to mint tokens)

If you are following the instructions in `https://github.com/soroswap/core` in order to deploy the smart contacts in your local environment and serve the API, your .env should look like this:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8010
```

If you are ready for production, you can take Futurenet Contracts information from `https://api.soroswap.finance` and just do

```bash
cp .env.production.example .env
```

❗️❗️ Note that some Futurenet RPC's might not have the same version, so we recomend you to connect to a local quickstart node following the instructions in `https://github.com/soroswap/core`; and setting up your Freighter Wallet as in step 6.

3. Start Docker

Navigate to the the `run.sh` script inside the `docker` folder

```bash
bash docker/run.sh
```

This script will set up and start the Docker containers required for Soroswap.

4. Install the Dependencies

After the Docker container is up, you will be inside the root folder on the container. Then, install the dependencies using Yarn:

```bash
yarn install
```

5. Run the Development Instance

Now you are ready to start the development instance. Run the following command:

```bash
yarn dev
```

This will start the Soroswap development instance.

6. Configure your Freigher Wallet

For Standalone network
| | |
|---|---|
| Name | Local Standalone |
| HORIZON RPC URL | http://localhost:8000 |
| SOROBAN RPC URL | http://localhost:8000/soroban/rpc |
| Passphrase | Standalone Network ; February 2017 |
| Friendbot | http://localhost:8000/friendbot |
| Allow HTTP connection | Enabled |
| Switch to this network | Enabled |

For Futurenet network
| | |
|---|---|
| Name | Local Futurenet|
| HORIZON RPC URL | http://localhost:8000 |
| SOROBAN RPC URL | http://localhost:8000/soroban/rpc |
| Passphrase | Test SDF Future Network ; October 2022 |
| Friendbot | http://localhost:8000/friendbot |
| Allow HTTP connection | Enabled |
| Switch to this network | Enabled |

** Important:** You should also do: Preferences> Allow experimental mode

7. Last, but not least, add some lumens to your Freighter wallet!

   Do it directly on the wallet or use:

   For Standalone: `http://localhost:8000/friendbot?addr=<your address>`
   For Futurenet, visit: https://laboratory.stellar.org/#create-account

🚀 Congrats! 🚀

You have successfully set up Soroswap on your local machine! Start swapping, pooling, and exploring the possibilities of decentralized finance (DeFi) on the Soroban network.

## Contributing

If you find a bug or have a feature request, please create an issue or submit a pull request. Contributions are always welcome!

License: MIT

## Acknowledgments

    Special thanks to the Uniswap team for providing the base protocol on which Soroswap is built.
    Thank you to the Stellar Community for the continuous support.

---

---

Made with ❤️ by the Soroswap Team.
