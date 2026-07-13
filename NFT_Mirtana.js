const NETWORKS = window.MirtanaProtocolConfig.NETWORKS;

const NFT_ABI = [{ "inputs": [{ "internalType": "address", "name": "initialOwner", "type": "address" }, { "internalType": "address", "name": "_MIRTATokenAddress", "type": "address" }, { "internalType": "uint256", "name": "_initialPrice", "type": "uint256" }, { "internalType": "address payable", "name": "_treasuryWallet", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC721IncorrectOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ERC721InsufficientApproval", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC721InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }], "name": "ERC721InvalidOperator", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC721InvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC721InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC721InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ERC721NonexistentToken", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "editionId", "type": "uint256" }], "name": "Minted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "MAX_NFTS_PER_WALLET", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MAX_SUPPLY", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIRTAToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getUserEditions", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getUserNFTs", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "hasEdition", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "editionId", "type": "uint256" }], "name": "mintByMIRTA", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "mintPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "baseURI", "type": "string" }], "name": "setBaseURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "setMintPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "newTreasury", "type": "address" }], "name": "setTreasuryWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "tokenIdToEditionId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "treasuryWallet", "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdrawNativeToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

const ERC20_ABI = ["function approve(address spender, uint256 amount) public returns (bool)", "function allowance(address owner, address spender) public view returns (uint256)"];

const monthNames = {
    1: "Mirtana January",
    2: "Mirtana February",
    3: "Mirtana March",
    4: "Mirtana April",
    5: "Mirtana May",
    6: "Mirtana June",
    7: "Mirtana July",
    8: "Mirtana August",
    9: "Mirtana September",
    10: "Mirtana October",
    11: "Mirtana November",
    12: "Mirtana December"
};


async function syncButtons() {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) return;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const config = NETWORKS[chainId.toLowerCase()];
    if (!config) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const nftContract = new ethers.Contract(config.nftAddress, NFT_ABI, provider);

    for (let i = 1; i <= 12; i++) {
        try {

            const hasMinted = await nftContract.hasEdition(accounts[0], i);

            const btn = document.querySelector(`button[onclick="mintNFT(${i})"]`);
            if (btn && hasMinted) {
                btn.innerText = "Minted";
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.background = "#333";
                btn.style.cursor = "default";
            }
        } catch (e) {
            console.error("Error syncing button " + i, e);
        }
    }
}

window.mintNFT = async function (editionId) {
    if (!window.ethereum) return alert("Install MetaMask!");
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const config = NETWORKS[chainId.toLowerCase()];
    if (!config) return alert("Please switch network!");

    const nftImages = {
        1: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeiefgqgikud4zzjqjwygpzk7r4tnbddxczxuv7digwscv5lnck5n74",
        2: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeias3gmfaj6532haybgotwmf3ixtvuyp2ktbhv5tobh43kwwysnili",
        3: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeibohyqlulcvneu364fpsfyz25u5bryquol3azmdi2ghlb4ruq7zjm",
        4: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeiap76t3o6xo73jnne6vjyyy2sxn2k57c4ftxoh2dmu56bomuu6y7y",
        5: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeig2ancpwjnsmjcs6yuuouz6n4hqfp6uhch5nia6hdg72rezfrgmpy",
        6: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeigsk4ccswblgk45ma7n7b4uhb7maxqfbsydm5gjiwjbdt77mchova",
        7: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeicn25bixcyq6eluts77ui4dhawjp3vw3n7fryznhqrasmgnuskviq",
        8: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeievt7kdqqxnlextsjhagpcclfqbg46mg6zeikky3ribwqrs3pj5we",
        9: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeibaasdyspehpm6ilymaars3vccycyzarhzxqmhvsuefra3qsvnbj4",
        10: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeie6emalqsqbxzvmmt6afseo2ktqcqzq6rvdqjejo2zjve4fqw3tia",
        11: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeifpgfz344q766fx2w55ajcs436bui5gl33mce6kzuegtj4h7mqkxu",
        12: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeiaprfe7pckfwui2xvwez5bbl77klw4nh75a5frveia7quolnxfrpm",
    };

    const nftImage = nftImages[editionId] || "https://via.placeholder.com/150";

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const user = await signer.getAddress();

        const nftContract = new ethers.Contract(config.nftAddress, NFT_ABI, signer);
        const mirtaContract = new ethers.Contract(config.mirtaToken, ERC20_ABI, signer);
        const price = await nftContract.mintPrice();


        if (window.openModal) {
            window.openModal('loading', 'Checking MIRTA allowance...');
        }

        const allowance = await mirtaContract.allowance(user, config.nftAddress);

        if (allowance < price) {
            if (window.openModal) {
                window.openModal('loading', 'Step 1/2: Please approve MIRTA usage in your wallet...');
            }
            const txApp = await mirtaContract.approve(config.nftAddress, price);
            await txApp.wait();
        }

        if (window.openModal) {
            window.openModal('loading', 'Step 2/2: Confirm the MINT transaction in your wallet...');
        }

        const txMint = await nftContract.mintByMIRTA(editionId);

        if (window.openModal) {
            window.openModal('loading', 'Minting your NFT on the blockchain...', txMint.hash);
        }

        await txMint.wait();
        const nftName = monthNames[editionId] || `Mirtana Month #${editionId}`;

        // Отправляем в n8n с передачей chainId
        await sendWeb3EventToN8n(
            user,
            txMint.hash,
            `Mint ${nftName} ${editionId}`,
            config.nftAddress,
            {
                nftName: nftName,
                editionId: editionId,
                chainId: Number(chainId) // Передаем ID сети из переменной, полученной выше
            }
        );


        const successFragment = document.createDocumentFragment();

        const wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.alignItems = 'center';
        wrap.style.gap = '6px';
        wrap.style.width = '100%';
        wrap.style.paddingTop = '5px';

        const tag = document.createElement('span');
        tag.style.color = '#00e8ff';
        tag.style.fontSize = '0.7em';
        tag.style.textTransform = 'uppercase';
        tag.style.letterSpacing = '2px';
        tag.style.opacity = '0.8';
        tag.textContent = 'Congratulations!';

        const imageBox = document.createElement('div');
        imageBox.style.width = '120px';
        imageBox.style.borderRadius = '10px';
        imageBox.style.overflow = 'hidden';
        imageBox.style.boxShadow = '0 0 15px rgba(0, 242, 255, 0.4)';
        imageBox.style.border = '1px solid rgba(0, 242, 255, 0.3)';
        imageBox.style.background = '#000';

        const image = document.createElement('img');
        image.src = nftImage;
        image.style.width = '100%';
        image.style.height = 'auto';
        image.style.display = 'block';
        imageBox.appendChild(image);

        const textBox = document.createElement('div');
        textBox.style.textAlign = 'center';

        const title = document.createElement('h2');
        title.style.color = '#ffffff';
        title.style.fontSize = '1.25em';
        title.style.fontWeight = '800';
        title.style.textShadow = '0 0 10px rgba(0, 242, 255, 0.6)';
        title.style.margin = '0';
        title.style.lineHeight = '1.2';
        title.textContent = nftName;

        const caption = document.createElement('p');
        caption.style.color = '#ffcc00';
        caption.style.fontWeight = '600';
        caption.style.fontSize = '0.8em';
        caption.style.margin = '2px 0 0 0';
        caption.textContent = '📦 added to your collection';

        textBox.appendChild(title);
        textBox.appendChild(caption);

        wrap.appendChild(tag);
        wrap.appendChild(imageBox);
        wrap.appendChild(textBox);

        successFragment.appendChild(wrap);

        if (window.openModal) {
            window.openModal('success', successFragment, txMint.hash, {}, true);
        }

        if (typeof syncButtons === "function") syncButtons();

    } catch (err) {
        console.error("Mint error:", err);

        if (err.code === "ACTION_REJECTED" || err.code === 4001) {
            if (window.closeStatusModal) window.closeStatusModal();
        } else {
            const reason = err.reason || err.message || "Transaction failed";
            if (window.openModal) {
                window.openModal('error', reason);
            }
        }
    }
};

if (window.ethereum) {
    window.ethereum.on('accountsChanged', syncButtons);
    window.ethereum.on('chainChanged', () => window.location.reload());
    window.addEventListener('load', () => setTimeout(syncButtons, 1000));
}
