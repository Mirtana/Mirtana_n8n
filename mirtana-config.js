(function (global) {
    const SHARED_CONFIG = {
        CONTRACT_CONFIG: {
            5042002: {
                networkName: "Arc Testnet",
                nativeTicker: "USDC",
                MIRTA: "0xad4d6Ed80F18768a1DdE5f2b6a97a900A5C874e1",
                SWAP_ADDRESS: "0x6935CF14a5F318Effd758D3d9454336134323383",
                explorerUrl: "https://testnet.arcscan.app",
                chainIdHex: "0x4cef52",
                rpcUrl: "https://rpc.testnet.arc.network"
            },
            46630: {
                networkName: "Robinhood Chain Testnet",
                nativeTicker: "ETH",
                MIRTA: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                SWAP_ADDRESS: "0xEf2EA09A748348f1D7e2D8ebF8534540FB0a21f1",
                explorerUrl: "https://explorer.testnet.chain.robinhood.com",
                chainIdHex: "0xB626",
                rpcUrl: "https://rpc.testnet.chain.robinhood.com"
            },
            1336: {
                networkName: "Kii Testnet",
                nativeTicker: "KII",
                MIRTA: "0x97773AAb730103aa2957E2Cc299488c41753b54C",
                SWAP_ADDRESS: "0x57bEDd058b9805B20613497aaB8dCcea1c0ED68E",
                explorerUrl: "https://testnet.explorer.kiichain.io",
                chainIdHex: "0x538",
                rpcUrl: "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com"
            },
            984: {
                networkName: "OPN Testnet",
                nativeTicker: "OPN",
                MIRTA: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                SWAP_ADDRESS: "0x0A0F9e4673D8B827aC5cF519Db05B6464Ce69A53",
                explorerUrl: "https://testnet.iopn.tech",
                chainIdHex: "0x3d8",
                rpcUrl: "https://testnet-rpc.iopn.tech"
            }
        },
        ADDRESSES: {
            5042002: {
                staking: "0x5956ac1Fc6178EC22d873dD1aC371E35253F5ff6",
                token: "0xad4d6Ed80F18768a1DdE5f2b6a97a900A5C874e1"
            },
            46630: {
                staking: "0x8AE8e28E19a66aDfD816Ab1833bAb8a734BDD09a",
                token: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6"
            },
            1336: {
                staking: "0xB86BDBE15A8377c7627708Cc96b28f8b2ab44781",
                token: "0x97773AAb730103aa2957E2Cc299488c41753b54C"
            },
            984: {
                staking: "0xB86BDBE15A8377c7627708Cc96b28f8b2ab44781",
                token: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6"
            }
        },
        GM_ADDRESSES: {
            5042002: "0x6B86aDdc998560f001ff4432DBc978adF06ba6Cb",
            46630: "0x7C3732b3712536A4f3720Ab198b9C1cCB431f84C",
            1336: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
            984: "0x6B86aDdc998560f001ff4432DBc978adF06ba6Cb"
        },
        FACTORY_CONFIG: {
            5042002: {
                address: "0xA9960EcB55E45bEd1c860259a157c81c6c3d1C18",
                explorer: "https://testnet.arcscan.app/tx/"
            },
            46630: {
                address: "0x1f6ac462b6322A06496ba14bE5D6b39e75DB2B40",
                explorer: "https://explorer.testnet.chain.robinhood.com/tx/"
            },
            1336: {
                address: "0x661921D1ea46423de41D7bB349E3745844fb3C81",
                explorer: "https://testnet.explorer.kiichain.io/tx/"
            },
            984: {
                address: "0xA9960EcB55E45bEd1c860259a157c81c6c3d1C18",
                explorer: "https://testnet.iopn.tech/tx/"
            }
        },
        MIRTA_CONFIG: {
            5042002: {
                address: "0xad4d6Ed80F18768a1DdE5f2b6a97a900A5C874e1",
                explorer: "https://testnet.arcscan.app/tx/"
            },
            46630: {
                address: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                explorer: "https://explorer.testnet.chain.robinhood.com/tx/"
            },
            1336: {
                address: "0x97773AAb730103aa2957E2Cc299488c41753b54C",
                explorer: "https://testnet.explorer.kiichain.io/tx/"
            },
            984: {
                address: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                explorer: "https://testnet.iopn.tech/tx/"
            }
        },
        NETWORKS: {
            "0x4cef52": {
                nftAddress: "0x392a38398ab7358947caCC77F244A5ee1D6091f5",
                mirtaToken: "0xad4d6Ed80F18768a1DdE5f2b6a97a900A5C874e1",
                explorer: "https://testnet.arcscan.app/tx/"
            },
            "0xb626": {
                nftAddress: "0xa37b518e9CC09FFb3280810Ff456999AC84D10cc",
                mirtaToken: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                explorer: "https://explorer.testnet.chain.robinhood.com/tx/"
            },
            "0x538": {
                nftAddress: "0xd46882eaF6a6afFBBDA58b82eff7934D2551E402",
                mirtaToken: "0x97773AAb730103aa2957E2Cc299488c41753b54C",
                explorer: "https://testnet.explorer.kiichain.io/tx/"
            },
            "0x3d8": {
                nftAddress: "0xE952ee8BA2B025f8Fa17779fb18aDeA387cAC811",
                mirtaToken: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                explorer: "https://testnet.iopn.tech/tx/"
            }
        },
        LIKES_CONFIG: {
            "0x4cef52": {
                likesAddress: "0xDBc2c5dE4ddE2277C464539722ae5eabB475d754",
                mirtaAddress: "0xad4d6Ed80F18768a1DdE5f2b6a97a900A5C874e1",
                explorer: "https://testnet.arcscan.app/tx/"
            },
            "0xb626": {
                likesAddress: "0xcd01d2f8c7910a62a39803834Be53694eaa884AF",
                mirtaAddress: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                explorer: "https://explorer.testnet.chain.robinhood.com/tx/"
            },
            "0x538": {
                likesAddress: "0xBf42e4059164a7d20e40811092EF6D51AF7FA81A",
                mirtaAddress: "0x97773AAb730103aa2957E2Cc299488c41753b54C",
                explorer: "https://testnet.explorer.kiichain.io/tx/"
            },
            "0x3d8": {
                likesAddress: "0xe7b781b80802391979EF65b8F753A6E02845b843",
                mirtaAddress: "0x9c256267EA5Fc6f77469bd0cB18498C335349Ab6",
                explorer: "https://testnet.iopn.tech/tx/"
            }
        }
    };

    global.MirtanaProtocolConfig = SHARED_CONFIG;
})(window);
