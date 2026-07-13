const pinataLinks = {
    1: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeiefgqgikud4zzjqjwygpzk7r4tnbddxczxuv7digwscv5lnck5n74",
    2: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeias3gmfaj6532haybgotwmf3ixtvuyp2ktbhv5tobh43kwwysnili",
    3: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeibohyqlulcvneu364fpsfyz25u5bryquol3azmdi2ghlb4ruq7zjm",
    4: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeicn25bixcyq6eluts77ui4dhawjp3vw3n7fryznhqrasmgnuskviq",
    5: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeig2ancpwjnsmjcs6yuuouz6n4hqfp6uhch5nia6hdg72rezfrgmpy",
    6: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeigsk4ccswblgk45ma7n7b4uhb7maxqfbsydm5gjiwjbdt77mchova",
    7: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeiap76t3o6xo73jnne6vjyyy2sxn2k57c4ftxoh2dmu56bomuu6y7y",
    8: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeievt7kdqqxnlextsjhagpcclfqbg46mg6zeikky3ribwqrs3pj5we",
    9: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeibaasdyspehpm6ilymaars3vccycyzarhzxqmhvsuefra3qsvnbj4",
    10: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeie6emalqsqbxzvmmt6afseo2ktqcqzq6rvdqjejo2zjve4fqw3tia",
    11: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeifpgfz344q766fx2w55ajcs436bui5gl33mce6kzuegtj4h7mqkxu",
    12: "https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafybeiaprfe7pckfwui2xvwez5bbl77klw4nh75a5frveia7quolnxfrpm",
};


// const NETWORKS = {
//     "0xB626": {
//         nftAddress: "0xa37b518e9CC09FFb3280810Ff456999AC84D10cc",
//         explorer: "https://explorer.testnet.chain.robinhood.com"
//     },
//     "0x4cef52": {
//         nftAddress: "0x392a38398ab7358947caCC77F244A5ee1D6091f5",
//         explorer: "https://testnet.arcscan.app"
//     }
// };


function createNFTCard(id, isOwned, realTokenId = null) {
    const fullName = monthNames[id];
    const safeName = String(fullName);

    const imagePath = pinataLinks[id];

    const statusClass = isOwned ? 'unlocked' : 'locked';
    const statusText = isOwned ? 'Unlocked' : 'Locked';

    const transferId = (realTokenId !== null) ? Number(realTokenId) : Number(id);

    const card = document.createElement('div');
    card.className = `nft-collection-card ${statusClass}`;

    const image = document.createElement('img');
    image.src = imagePath;
    image.className = 'nft-card-img';
    image.alt = safeName;

    const info = document.createElement('div');
    info.className = 'nft-card-info';

    const title = document.createElement('h4');
    title.className = 'nft-month';
    title.textContent = safeName;

    const status = document.createElement('span');
    status.className = 'nft-status';
    status.textContent = statusText;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    if (isOwned) {
        const button = document.createElement('button');
        button.className = 'btn-transfer-card';
        button.dataset.id = String(transferId);
        button.dataset.name = safeName;
        button.textContent = 'TRANSFER';
        actions.appendChild(button);
    } else {
        const button = document.createElement('button');
        button.className = 'btn-mint-card';
        button.onclick = () => showSection('nft-mint-section', button);
        button.textContent = 'MINT NOW';
        actions.appendChild(button);
    }

    info.appendChild(title);
    info.appendChild(status);
    info.appendChild(actions);

    card.appendChild(image);
    card.appendChild(info);

    return card;
}

async function loadDashboard() {
    const grid = document.getElementById('nft-collection-grid');
    const countDisplay = document.getElementById('user-nft-count');
    if (!grid) return;

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        let signer;
        let userAddress;

        try {
            signer = await provider.getSigner();
            userAddress = await signer.getAddress();
        } catch (e) {
            console.warn("Wallet not connected");
            return;
        }

        const network = await provider.getNetwork();
        const chainId = "0x" + network.chainId.toString(16).toLowerCase();
        const currentConfig = NETWORKS[chainId];
        if (!currentConfig) return;

        const nftContract = new ethers.Contract(currentConfig.nftAddress, NFT_ABI, signer);

        const userTokenIds = await nftContract.getUserNFTs(userAddress);
        const userEditions = await nftContract.getUserEditions(userAddress);

        const ownershipMap = {};
        userEditions.forEach((edition, index) => {
            ownershipMap[Number(edition)] = Number(userTokenIds[index]);
        });

        const fragment = document.createDocumentFragment();

        if (!grid.dataset.listenerAttached) {
            grid.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-transfer-card');
                if (!btn) return;

                const id = Number(btn.dataset.id);
                const name = btn.dataset.name;

                prepareTransfer(id, name);
            });

            grid.dataset.listenerAttached = "true";
        }

        let ownedCount = 0;

        for (let monthId = 1; monthId <= 12; monthId++) {
            const realId = ownershipMap[monthId];
            const isOwned = (realId !== undefined);

            if (isOwned) ownedCount++;

            fragment.appendChild(createNFTCard(monthId, isOwned, realId));
        }

        grid.replaceChildren(fragment);

        if (countDisplay) countDisplay.innerText = ownedCount;

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}


function prepareTransfer(tokenId, name) {

    const escapeHTML = (str) =>
        String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const safeName = escapeHTML(name);
    const safeTokenId = Number(tokenId);

    const content = `
        <div class="transfer-box" style="text-align:center;">
            <p style="margin-bottom: 15px; color: #fff; font-size: 14px;">
                You are transferring <b>${safeName}</b><br>
                <span style="color: #00f2ff; font-size: 12px;">Token ID: ${safeTokenId}</span>
            </p>
            <input type="text" id="destAddress" placeholder="0x... Recipient Address"
                   style="width:100%; padding:12px; border-radius:8px; border:1px solid #333; background:#1a1a1a; color:white; outline:none; font-size: 13px;">
            <button id="confirmTransferBtn" class="mint-btn"
                    style="margin-top: 20px; width: 100%; cursor: pointer;">
                SEND ASSET
            </button>
        </div>
    `;

    updateModal("Transfer NFT", content, false, true);

    const btn = document.getElementById("confirmTransferBtn");
    if (btn) {
        btn.onclick = () => executeTransfer(safeTokenId, safeName);
    }

    const txInfo = document.getElementById("txInfo");
    const closeBtn = document.getElementById("statusCloseBtn");

    if (txInfo) txInfo.style.display = "none";
    if (closeBtn) closeBtn.style.display = "none";
}

async function executeTransfer(tokenId, name) {
    const to = document.getElementById('destAddress').value.trim();
    const txInfo = document.getElementById("txInfo");
    const closeBtn = document.getElementById("statusCloseBtn");

    if (!window.ethereum) {
        updateModal("Error", "Wallet not found", false);
        if (closeBtn) closeBtn.style.display = "block";
        return;
    }

    if (!ethers.isAddress(to)) {
        updateModal("Error", "Invalid wallet address.", false);
        if (closeBtn) closeBtn.style.display = "block";
        return;
    }

    try {
        updateModal("Processing", "Confirm transaction in your wallet...", true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const chainId = "0x" + network.chainId.toString(16).toLowerCase();

        const currentConfig = NETWORKS?.[chainId];

        if (!currentConfig || !currentConfig.nftAddress) {
            updateModal("Error", "Unsupported network", false);
            if (closeBtn) closeBtn.style.display = "block";
            return;
        }

        const nftContract = new ethers.Contract(currentConfig.nftAddress, NFT_ABI, signer);
        const tx = await nftContract.safeTransferFrom(await signer.getAddress(), to, tokenId);

        let explorerBase = currentConfig.explorer || "";
        explorerBase = explorerBase.replace(/\/$/, '');
        const explorerUrl = `${explorerBase}/${tx.hash}`;


        const safeHash = escapeHTML(tx.hash);
        const safeName = escapeHTML(name);

        const pendingContent = `
            <div style="text-align:center;">
                <p>Transferring <b>${safeName}</b>...</p>
                <p style="margin: 15px 0;">
                    <small style="opacity:0.5; font-size:10px; word-break:break-all;">
                        Hash: ${safeHash}
                    </small>
                </p>
            </div>
        `;
        updateModal("Pending", pendingContent, true, true);

        if (txInfo) {
            txInfo.style.display = "block";

            const stakedText = txInfo.querySelector('p');
            if (stakedText) stakedText.style.display = "none";

            const link = document.getElementById("explorerLink");
            if (link) {
                link.href = explorerUrl;
                link.style.display = "inline-block";
            }
        }

        await tx.wait();

        updateModal("Success", `<b>${safeName}</b> successfully transferred!`, false, true);
        if (closeBtn) closeBtn.style.display = "block";

        setTimeout(() => {
            if (typeof loadDashboard === "function") loadDashboard();
        }, 2000);

    } catch (e) {
        console.error(e);

        let errorMsg = e.reason || e.message || "Transaction failed";

        updateModal("Error", errorMsg, false, false);
        if (closeBtn) closeBtn.style.display = "block";

        const stakedText = txInfo?.querySelector('p');
        if (stakedText) stakedText.style.display = "block";
    }
}

function updateModal(title, content, showLoader = false, isHtml = false) {
    const modal = document.getElementById("statusModal");
    const titleEl = document.getElementById("statusTitle");
    const messageEl = document.getElementById("statusMessage");
    const loaderEl = document.getElementById("statusLoader");
    const closeBtn = document.getElementById("statusCloseBtn");

    if (!modal || !titleEl || !messageEl) {
        console.error("Элементы модального окна не найдены в HTML!");
        return;
    }

    titleEl.innerText = title;
    messageEl.replaceChildren();

    if (isHtml) {
        messageEl.appendChild(sanitizeModalHtml(content));
    } else {
        messageEl.textContent = content;
    }

    if (loaderEl) loaderEl.style.display = showLoader ? "block" : "none";

    if (closeBtn) {
        closeBtn.style.display = showLoader ? "none" : "block";
        closeBtn.onclick = () => modal.style.display = "none";
    }

    modal.style.display = "flex";
}

function sanitizeModalHtml(html) {
    const template = document.createElement('template');
    template.innerHTML = String(html);

    const blockedTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base'];
    template.content.querySelectorAll(blockedTags.join(',')).forEach(node => node.remove());

    template.content.querySelectorAll('*').forEach(element => {
        Array.from(element.attributes).forEach(attribute => {
            const name = attribute.name.toLowerCase();
            const value = attribute.value.trim();

            if (name.startsWith('on')) {
                element.removeAttribute(attribute.name);
                return;
            }

            if ((name === 'href' || name === 'src' || name === 'xlink:href' || name === 'formaction') && /^javascript:/i.test(value)) {
                element.removeAttribute(attribute.name);
            }
        });
    });

    return template.content;
}
