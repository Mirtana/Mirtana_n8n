// ==========================================
// 1. КОНФИГУРАЦИЯ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ==========================================

const CONTRACT_CONFIG = window.MirtanaProtocolConfig.CONTRACT_CONFIG;
const SWAP_ABI = [{ "inputs": [{ "internalType": "address", "name": "_mirtaToken", "type": "address" }, { "internalType": "uint256", "name": "_initialPrice", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "LiquidityAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "mirtaAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethAmount", "type": "uint256" }], "name": "Swapped", "type": "event" }, { "inputs": [], "name": "buyBackPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "fundLiquidity", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "mirtaToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newPrice", "type": "uint256" }], "name": "setBuyBackPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_mirtaAmount", "type": "uint256" }], "name": "swapMirtaToEth", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdrawEth", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdrawMirta", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];

const MIRTA_ABI = [{ "inputs": [{ "internalType": "address", "name": "initialOwner", "type": "address" }, { "internalType": "address payable", "name": "_treasuryWallet", "type": "address" }, { "internalType": "uint256", "name": "_initialMintPrice", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "PriceUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "totalCost", "type": "uint256" }], "name": "TokensMinted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldTreasury", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newTreasury", "type": "address" }], "name": "TreasuryUpdated", "type": "event" }, { "stateMutability": "payable", "type": "fallback" }, { "inputs": [], "name": "MAX_SUPPLY", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "mintPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "setMintPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "newTreasury", "type": "address" }], "name": "setTreasuryWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "treasuryWallet", "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];

let provider, signer, MIRTAContract;
let userAccount = null;
let currentPriceWei = 0n;



// =========================================
// 2. ИНИЦИАЛИЗАЦИЯ И ПОДКЛЮЧЕНИЕ
// =========================================

async function connect() {
    if (!window.ethereum) return alert("Install Wallet");
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        userAccount = await signer.getAddress();

        const net = await provider.getNetwork();
        const chainId = Number(net.chainId);

        if (setupContracts(chainId, signer)) {
            document.getElementById('connect-btn').innerText = `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
            document.getElementById('balances').classList.remove('hidden');
            document.getElementById('mintBtn').disabled = false;
            document.getElementById('mintBtnText').innerText = "MINT NOW";

            await fetchMIRTAData();
            await updateBalances();
            await updateMintProgress();
            await initSwap();
            await checkGMStatus();
        }

        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
    } catch (e) { console.error(e); }
}

async function init() {
    await syncNetworkDisplay();
    await updateMintProgress();

    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connect();
        }
    }
}

async function initStaking() {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            globalSigner = await provider.getSigner();

            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);

            if (ADDRESSES[chainId]) {
                STAKING_ADDRESS = ADDRESSES[chainId].staking;
                MIRTA_TOKEN_ADDRESS = ADDRESSES[chainId].token;
            } else {
                console.error("❌ Unsupported network:", chainId);
                return;
            }

            stakingContract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, globalSigner);
            await loadUserStakes();
        } catch (e) {
            console.error("Init Error:", e);
        }
    }
}

function setupContracts(chainId, signerOrProvider) {
    const config = CONTRACT_CONFIG[Number(chainId)];
    if (!config) {
        triggerModal("Wrong Network", "Please switch to Robinhood or Arc Network!", "error");
        return false;
    }

    if (config.MIRTA && config.MIRTA !== "0x0000000000000000000000000000000000000000") {
        MIRTAContract = new ethers.Contract(config.MIRTA, MIRTA_ABI, signerOrProvider);
        return true;
    } else {
        console.warn("MIRTA Contract not deployed on this network yet.");
        return false;
    }
}




// =========================================
// 3. ПОЛУЧЕНИЕ ДАННЫХ И ОБНОВЛЕНИЕ UI
// =========================================

async function fetchMIRTAData() {
    if (!MIRTAContract) return;
    try {
        const price = await MIRTAContract.mintPrice();
        currentPriceWei = price;

        const net = await provider.getNetwork();
        const chainId = Number(net.chainId);
        const config = CONTRACT_CONFIG[chainId];

        const priceDisplay = document.getElementById('priceDisplay');
        if (priceDisplay && config) {
            const ticker = config.nativeTicker || "NATIVE";
            priceDisplay.innerText = `${ethers.formatEther(price)} ${ticker}`;
        }
    } catch (e) {
        console.error("Ошибка загрузки цены:", e);
    }
}

async function updateBalances() {
    if (!userAccount || !provider) return;

    const balance = await provider.getBalance(userAccount);
    document.getElementById('native-balance').innerText = parseFloat(ethers.formatEther(balance)).toFixed(4);

    if (MIRTAContract) {
        const tokenBal = await MIRTAContract.balanceOf(userAccount);
        document.getElementById('mirta-balance').innerText = parseFloat(ethers.formatUnits(tokenBal, 18)).toFixed(2);
    }
}

async function updateMintProgress() {
    if (!MIRTAContract) return;
    try {
        const totalSupply = await MIRTAContract.totalSupply();
        const maxSupply = await MIRTAContract.MAX_SUPPLY();

        if (maxSupply === 0n) return;

        const progressBP = (totalSupply * 10000n) / maxSupply;
        const percentage = Number(progressBP) / 100;

        const minted = Number(ethers.formatUnits(totalSupply, 18)).toLocaleString();
        const total = Number(ethers.formatUnits(maxSupply, 18)).toLocaleString();

        const bar = document.getElementById('supplyBar');
        const textPercent = document.getElementById('soldPercentage');
        const textMinted = document.getElementById('mintedAmount');
        const textMax = document.getElementById('maxSupplyAmount');

        if (bar) bar.style.width = percentage + "%";
        if (textPercent) textPercent.innerText = percentage.toFixed(2) + "% SOLD";
        if (textMinted) textMinted.innerText = minted;
        if (textMax) textMax.innerText = total;

    } catch (e) {
        console.error("Error updating progress bar:", e);
    }
}

async function syncNetworkDisplay() {
    if (!window.ethereum) return;
    try {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const network = await tempProvider.getNetwork();
        const chainId = Number(network.chainId);

        const config = CONTRACT_CONFIG[chainId];
        const networkBtn = document.getElementById('current-network');
        const tickerInput = document.getElementById('nativeTickerInput');

        if (config && networkBtn) {
            networkBtn.replaceChildren();

            const icon = document.createElement('i');
            icon.className = 'fas fa-network-wired';
            networkBtn.appendChild(icon);
            networkBtn.appendChild(document.createTextNode(` ${config.networkName}`));

            if (tickerInput) tickerInput.innerText = config.nativeTicker;
        } else if (networkBtn) {
            networkBtn.replaceChildren();

            const icon = document.createElement('i');
            icon.className = 'fas fa-exclamation-triangle';
            networkBtn.appendChild(icon);
            networkBtn.appendChild(document.createTextNode(' Select Network'));
        }
    } catch (e) {
        console.error("Ошибка определения сети:", e);
    }
}

async function switchNetwork(targetChainId) {
    const config = CONTRACT_CONFIG[Number(targetChainId)];
    if (!config) {
        console.error("Network configuration not found for ID:", targetChainId);
        return;
    }

    const hexChainId = config.chainIdHex || '0x' + Number(targetChainId).toString(16);

    try {

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }],
        });
    } catch (switchError) {

        if (switchError.code === 4902 || switchError.code === -32603) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: hexChainId,
                        chainName: config.networkName,
                        rpcUrls: [config.rpcUrl],
                        nativeCurrency: {
                            name: config.nativeTicker,
                            symbol: config.nativeTicker,
                            decimals: 18
                        },
                        blockExplorerUrls: [config.explorerUrl]
                    }]
                });
            } catch (addError) {
                console.error("User rejected adding the network");
            }
        }
    }
}



// ==========================================
// 4. ЛОГИКА МИНТА И КАЛЬКУЛЯТОРА
// ==========================================

async function ensureCorrectNetwork() {
    const net = await provider.getNetwork();
    if (!CONTRACT_CONFIG[Number(net.chainId)]) {
        throw new Error("Wrong network");
    }
}

async function mintToken() {
    if (!MIRTAContract) return alert("Contract not loaded. Connect wallet first.");

    try {
        const val = document.getElementById('mintAmountEth').value;
        if (!/^\d*\.?\d+$/.test(val) || Number(val) <= 0) {
            return alert("Invalid amount");
        }

        if (typeof ensureCorrectNetwork === "function") {
            await ensureCorrectNetwork();
        }

        const weiToPay = ethers.parseEther(val.toString());

        if (!currentPriceWei || currentPriceWei === 0n) {
            return alert("Price not loaded");
        }

        const tokensCount = weiToPay / currentPriceWei;

        if (typeof openModal === "function") {
            openModal('loading', 'Waiting for wallet confirmation...');
        }

        const tx = await MIRTAContract.mint(tokensCount, { value: weiToPay });

        if (typeof openModal === "function") {
            openModal('loading', 'Processing transaction...', tx.hash);
        }


       // 1. Ждем подтверждения от блокчейна
       await tx.wait();

        // 2. Определяем chainId
        let chainId = 46630;
        if (window.ethereum) {
            try {
                const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
                chainId = Number(hexChainId);
            } catch (e) { console.error(e); }
        }

        // 3. БЕЗОПАСНОЕ ОПРЕДЕЛЕНИЕ contractAddr (выносим это выше)
        let contractAddr = "";
        if (MIRTAContract.target) {
            contractAddr = MIRTAContract.target;
        } else if (typeof MIRTAContract.getAddress === "function") {
            contractAddr = await MIRTAContract.getAddress();
        } else {
            contractAddr = MIRTAContract.address;
        }

        const actionName = `Mint ${tokensCount.toString()} MIRTA`;

        // 4. Теперь переменные contractAddr и chainId гарантированно существуют!
        await sendWeb3EventToN8n(
            userAccount,
            tx.hash,
            actionName,
            contractAddr,
            { chainId: chainId }
        );

        // 3. Логируем в консоль, чтобы ты СВОИМИ ГЛАЗАМИ увидел, что процесс пошел
        console.log("Транзакция успешна! Сейчас вызову вебхук...");

        // 4. Отправляем данные в n8n
        // await sendWeb3EventToN8n(userAccount, tx.hash, actionName, contractAddr);

        if (typeof openModal === "function") {
            openModal('success', `Successfully minted ${tokensCount} MIRTA!`, tx.hash);
        }

        await updateBalances();
        await updateMintProgress();

    } catch (error) {
        // 🔥 ВАЖНО: Если что-то пошло не так, мы ОБЯЗАТЕЛЬНО выведем это в консоль, чтобы увидеть причину
        console.error("🚨 КРИТИЧЕСКАЯ ОШИБКА ВНУТРИ MINT_TOKEN:", error);

        if (typeof openModal === "function") {
            openModal('error', error.reason || error.message || "Transaction failed");
        }
    }
}

async function setMaxMint() {
    if (!signer || !userAccount) {
        console.error("Wallet not connected");
        return;
    }

    try {

        const balance = await provider.getBalance(userAccount);

        const gasReserve = ethers.parseEther("0.001");

        let finalAmount;
        if (balance > gasReserve) {
            finalAmount = balance - gasReserve;
        } else {
            finalAmount = 0n;
        }

        const formatted = ethers.formatEther(finalAmount);

        const input = document.getElementById('mintAmountEth');

        if (input) {
            input.value = formatted;

            input.dispatchEvent(new Event('input'));
        }

    } catch (e) {
        console.error("Error setting max balance:", e);
    }
}

async function addTokenToWallet() {
    const chainId = Number(await window.ethereum.request({ method: 'eth_chainId' }));
    const config = CONTRACT_CONFIG[chainId];
    if (!config) return alert("Сначала подключитесь к правильной сети!");

    try {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: config.MIRTA,
                    symbol: 'MIRTA',
                    decimals: 18,
                    image: 'https://orange-characteristic-lion-588.mypinata.cloud/ipfs/bafkreidsp4ixqkzslgj7q5wx5lqpzizblu7qzyzmbxq4cbpgjd5sflxiyq',
                },
            },
        });
    } catch (error) { console.error("Ошибка при добавлении токена:", error); }
}

function showSection(sectionId, element) {

    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(sec => {
        sec.classList.remove('active');
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    element.classList.add('active');

    if (sectionId === 'TokenFactory-section') {
        loadUserTokens();
    }

    if (sectionId === 'dashboard-section') {
        loadDashboard();
    }
}


// ==========================================
// 5. МОДАЛЬНЫЕ ОКНА И UI ВЗАИМОДЕЙСТВИЕ
// ==========================================

function openModal(type, message, txHash = null, extra = {}, isHtml = false) {
    const modal = document.getElementById('statusModal');
    const loader = document.getElementById('statusLoader');
    const title = document.getElementById('statusTitle');
    const msg = document.getElementById('statusMessage');
    const txInfo = document.getElementById('txInfo');
    const stakedInfo = document.getElementById('stakedAmountInfo');
    const link = document.getElementById('explorerLink');
    const closeBtn = document.getElementById('statusCloseBtn');

    if (!modal || !msg) return;

    modal.style.display = 'flex';
    if (txInfo) txInfo.style.display = 'none';
    if (stakedInfo && stakedInfo.parentElement) stakedInfo.parentElement.style.display = 'none';

    const chainId = window.ethereum ? Number(window.ethereum.chainId) : null;
    const config = chainId ? CONTRACT_CONFIG[chainId] : null;
    const explorerUrl = config ? config.explorerUrl : "";

    if (type === 'loading') {
        setModalText(title, "Processing...");
        if (title) title.style.color = "#00f2ff";
        if (loader) loader.style.display = 'block';
        if (closeBtn) closeBtn.style.display = 'none';
    }
    else if (type === 'success') {
        setModalText(title, "Success!");
        if (title) title.style.color = "#00ff88";
        if (loader) loader.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'block';
    }
    else if (type === 'error') {
        setModalText(title, "Error");
        if (title) title.style.color = "#ff4d4d";
        if (loader) loader.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'block';
    }

    // 🔐 КЛЮЧЕВОЙ МОМЕНТ
    msg.replaceChildren();

    if (message instanceof Node) {
        msg.appendChild(message);
    }
    else if (isHtml) {
        msg.appendChild(sanitizeModalHtml(message));
    } else {
        msg.textContent = message;
    }

    if (txHash && explorerUrl) {
        if (txInfo) txInfo.style.display = 'block';
        if (link) link.href = `${explorerUrl}/tx/${txHash}`;

        if (extra.stakedAmount && stakedInfo) {
            if (stakedInfo.parentElement) stakedInfo.parentElement.style.display = 'block';
            stakedInfo.textContent = extra.stakedAmount;
        }
    }
}

function setModalText(element, value) {
    if (!element) return;
    element.textContent = value;
}

function closeStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) modal.style.display = 'none';
}

function closeModal() {
    closeStatusModal();
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

function triggerModal(title, message, type = 'info') {
    const modalType = (type === 'error') ? 'error' : 'success';
    openModal(modalType, message);
    document.getElementById('statusTitle').innerText = title;
}


// ==========================================
// 6. СЛУШАТЕЛИ И ОБРАБОТЧИКИ СОБЫТИЙ
// ==========================================

document.getElementById('mintAmountEth').addEventListener('input', function () {
    const val = this.value;
    if (val > 0 && currentPriceWei > 0n) {
        const weiToPay = ethers.parseEther(val.toString());
        const amount = weiToPay / currentPriceWei;
        document.getElementById('calcOutput').innerText = `${amount.toString()} MIRTA`;
    } else {
        document.getElementById('calcOutput').innerText = "0 MIRTA";
    }
});

document.getElementById('connect-btn').onclick = connect;
document.getElementById('mintBtn').onclick = mintToken;

const networkBtn = document.getElementById('current-network');
const networkList = document.getElementById('network-list');

if (networkBtn && networkList) {
    networkBtn.onclick = function (e) {
        e.stopPropagation();
        networkList.classList.toggle('show');
    };
}

if (networkList) {
    networkList.onclick = async (e) => {
        const target = e.target.closest('a');
        if (!target) return;
        e.preventDefault();
        networkList.classList.remove('show');

        const chainId = target.getAttribute('data-chain-id');
        await switchNetwork(chainId);
    };
}

window.addEventListener('load', init);
window.onclick = () => { if (networkList) networkList.classList.remove('show'); };

window.addEventListener('click', function (event) {
    const statusModal = document.getElementById('statusModal');
    const txModal = document.getElementById('txModal');
    const loader = document.getElementById('statusLoader');

    if (event.target === statusModal) {
        const isIdle = !loader || loader.style.display === 'none';
        if (isIdle) {
            closeStatusModal();
        }
    }

    if (event.target === txModal) {
        closeModal();
    }
});
