const FACTORY_CONFIG = window.MirtanaProtocolConfig.FACTORY_CONFIG;
const FACTORY_ABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": false, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" }, { "indexed": false, "internalType": "string", "name": "tokenType", "type": "string" }], "name": "TokenCreated", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allCreatedTokens", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "supply", "type": "uint256" }, { "internalType": "uint8", "name": "tokenType", "type": "uint8" }], "name": "createToken", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getAllTokensCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserTokens", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "userToTokens", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];

let selectedType = 0;


function selectTokenType(type, element) {
    selectedType = type;
    document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}
const escapeHTML = (str) =>
    String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

async function deployToken() {
    const name = document.getElementById('tokenName').value;
    const symbol = document.getElementById('tokenSymbol').value;
    const supply = document.getElementById('tokenSupply').value;

    if (
        !name.trim() ||
        !symbol.trim() ||
        !/^\d+$/.test(supply)
    ) {
        return window.openModal
            ? window.openModal('error', 'Invalid input data')
            : alert("Invalid input");
    }

    const supplyBigInt = BigInt(supply);
    if (supplyBigInt <= 0n) {
        return alert("Supply must be greater than 0");
    }

    try {
        await ensureCorrectNetwork();

        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        const config = FACTORY_CONFIG[chainId];

        if (!config) {
            if (window.openModal) {
                window.openModal('error', 'Unsupported Network. Please switch to Arc or Robinhood.');
            }
            return;
        }

        if (window.openModal) {
            const safeName = escapeHTML(name);
            const safeSymbol = escapeHTML(symbol);

            window.openModal('loading', `Preparing to deploy ${safeName} (${safeSymbol})...`);
        }

        const factory = new ethers.Contract(config.address, FACTORY_ABI, signer);

        const tx = await factory.createToken(name, symbol, supply, selectedType);

        if (window.openModal) {
            window.openModal('loading', 'Deploying your smart contract to the blockchain...', tx.hash);
        }

       await tx.wait();

        // Отправляем в n8n, используя уже объявленный ранее chainId
        await sendWeb3EventToN8n(
            await signer.getAddress(), // Получаем адрес владельца
            tx.hash,
            `Deploy: ${name} (${symbol})`, // Краткое описание события
            config.address, // Адрес фабрики, через которую деплоили
            {
                tokenName: name,
                tokenSymbol: symbol,
                totalSupply: supply,
                tokenType: selectedType,
                chainId: chainId // <-- Просто добавляем уже существующую переменную!
            }
        );


        if (window.openModal) {
            const safeName = escapeHTML(name);
            const successFragment = document.createDocumentFragment();

            const heading = document.createElement('div');
            heading.style.color = '#00f2ff';
            heading.style.fontWeight = 'bold';
            heading.style.marginBottom = '10px';
            heading.textContent = 'Token Deployed Successfully!';

            const paragraph = document.createElement('p');
            paragraph.textContent = 'Your custom smart contract ';

            const strong = document.createElement('strong');
            strong.textContent = safeName;
            paragraph.appendChild(strong);
            paragraph.appendChild(document.createTextNode(' is now live on the network.'));

            successFragment.appendChild(heading);
            successFragment.appendChild(paragraph);

            window.openModal('success', successFragment, tx.hash, {}, true);
        }

        document.getElementById('tokenName').value = "";
        document.getElementById('tokenSymbol').value = "";
        document.getElementById('tokenSupply').value = "";

        setTimeout(() => { loadUserTokens(); }, 1500);

    } catch (e) {
        console.error("Deployment Error:", e);

        if (e.code === 4001) {
            if (window.closeStatusModal) window.closeStatusModal();
        } else {
            const errorMsg = e.reason || e.message || "Something went wrong during deployment.";
            if (window.openModal) {
                window.openModal('error', errorMsg);
            }
        }
    }
}

async function loadUserTokens() {
    if (!userAccount || !provider) return;
    const list = document.getElementById('userTokensList');
    if (!list) return;

    const renderMessage = (text, color = '#a0a0a0') => {
        list.replaceChildren();
        const message = document.createElement('p');
        message.style.textAlign = 'center';
        message.style.opacity = color === '#a0a0a0' ? '0.6' : '1';
        message.style.color = color;
        message.textContent = text;
        list.appendChild(message);
    };

    try {
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        const config = FACTORY_CONFIG[chainId];

        if (!config) {
            renderMessage('Unsupported network.');
            return;
        }

        const factory = new ethers.Contract(config.address, FACTORY_ABI, provider);
        const tokenAddresses = await factory.getUserTokens(userAccount);

        if (tokenAddresses.length === 0) {
            renderMessage("You haven't created any tokens here yet.");
            return;
        }

        const ERC20_ABI = [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function totalSupply() view returns (uint256)",
            "function decimals() view returns (uint8)"
        ];

        const tokenDataPromises = tokenAddresses.map(async (addr) => {
            const tokenContract = new ethers.Contract(addr, ERC20_ABI, provider);
            try {
                const [name, symbol, total, decimals] = await Promise.all([
                    tokenContract.name(),
                    tokenContract.symbol(),
                    tokenContract.totalSupply(),
                    tokenContract.decimals()
                ]);
                const formattedTotal = ethers.formatUnits(total, decimals);
                return { addr, name, symbol, total: formattedTotal };
            } catch (err) {
                return { addr, name: "Unknown", symbol: "???", total: "0" };
            }
        });

        const allTokens = await Promise.all(tokenDataPromises);

        const fragment = document.createDocumentFragment();

        allTokens.reverse().forEach(token => {
            const item = document.createElement('div');
            item.className = 'token-item';

            const info = document.createElement('div');
            info.className = 'token-info';

            const header = document.createElement('div');
            header.className = 'token-header';

            const title = document.createElement('h4');
            title.append(document.createTextNode(token.name));

            const symbolSpan = document.createElement('span');
            symbolSpan.textContent = ` (${token.symbol})`;
            title.appendChild(symbolSpan);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-mini-btn';
            copyBtn.dataset.addr = token.addr;

            const copyIcon = document.createElement('i');
            copyIcon.className = 'fas fa-copy';
            copyBtn.appendChild(copyIcon);

            header.appendChild(title);
            header.appendChild(copyBtn);

            const stats = document.createElement('div');
            stats.className = 'token-stats';

            const supply = document.createElement('p');
            supply.textContent = 'Supply: ';
            const supplyStrong = document.createElement('strong');
            supplyStrong.textContent = parseFloat(token.total).toLocaleString();
            supply.appendChild(supplyStrong);

            const address = document.createElement('span');
            address.textContent = `${token.addr.substring(0, 10)}...${token.addr.substring(token.addr.length - 4)}`;

            stats.appendChild(supply);
            stats.appendChild(address);

            info.appendChild(header);
            info.appendChild(stats);
            item.appendChild(info);
            fragment.appendChild(item);
        });

        list.replaceChildren(fragment);

        list.querySelectorAll('.copy-mini-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const addr = btn.dataset.addr;
                copyToClipboard(addr, btn);
            });
        });

    } catch (e) {
        console.error("Load dashboard error:", e);
        renderMessage('Error loading token list.', '#ff4d4d');
    }
}

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.replace('fa-copy', 'fa-check');
            icon.style.color = '#00f2ff';
            setTimeout(() => {
                icon.classList.replace('fa-check', 'fa-copy');
                icon.style.color = '';
            }, 2000);
        }
    });
}


