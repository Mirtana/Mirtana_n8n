// ==========================================
// 1. КОНФИГУРАЦИЯ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ==========================================

const ADDRESSES = window.MirtanaProtocolConfig.ADDRESSES;

const EXPLORERS = {
    46630: "https://explorer.testnet.chain.robinhood.com/tx/",
    5042002: "https://testnet.arcscan.app/tx/",
    1336: "https://testnet.explorer.kiichain.io/tx/",
    984: "https://testnet.iopn.tech/tx/",
    11155111: "https://sepolia.etherscan.io/tx/"
};

const STAKING_ABI = [{ "inputs": [{ "internalType": "address", "name": "initialOwner", "type": "address" }, { "internalType": "address", "name": "_token", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "REWARD_RATE", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "enum MirtanaStaking.StakingTier", "name": "tier", "type": "uint8" }], "name": "calculateReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "fundRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "enum MirtanaStaking.StakingTier", "name": "tier", "type": "uint8" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stakingToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "enum MirtanaStaking.StakingTier", "name": "", "type": "uint8" }], "name": "tierConfigs", "outputs": [{ "internalType": "uint256", "name": "lockDuration", "type": "uint256" }, { "internalType": "uint256", "name": "rewardMultiplier", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalStaked", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "enum MirtanaStaking.StakingTier", "name": "tier", "type": "uint8" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "enum MirtanaStaking.StakingTier", "name": "", "type": "uint8" }], "name": "userStakes", "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "lockDuration", "type": "uint256" }, { "internalType": "uint256", "name": "rewardDebt", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

const plans = [
    { id: 0, name: "Flexible", apy: "10.5%" },
    { id: 1, name: "7 Days", apy: "15%" },
    { id: 2, name: "30 Days", apy: "18%" },
    { id: 3, name: "90 Days", apy: "22.5%" }
];

let stakingContract;
let globalSigner;
let selectedTier = 0;
let STAKING_ADDRESS;
let MIRTA_TOKEN_ADDRESS;



// ==========================================
// 2. СЛУЖЕБНЫЕ ФУНКЦИИ И ИНИЦИАЛИЗАЦИЯ
// ==========================================

async function updateContractAddresses() {
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    const currentConfig = ADDRESSES[chainId];

    if (!currentConfig) {
        alert("This network is not supported!");
        return false;
    }

    MIRTA_TOKEN_ADDRESS = currentConfig.token;
    STAKING_ADDRESS = currentConfig.staking;
    return true;
}

async function setMaxStake() {
    if (!userAccount || !signer) return;
    try {

        const tokenAddr = MIRTA_TOKEN_ADDRESS;
        if (!tokenAddr) return;

        const minABI = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];
        const tokenContract = new ethers.Contract(tokenAddr, minABI, provider);


        // 3. Получаем баланс и количество знаков
        const [balance, decimals] = await Promise.all([
            tokenContract.balanceOf(userAccount),
            tokenContract.decimals()
        ]);

        // 4. Форматируем в понятное число (например, из 1000000000000000000 в 1.0)
        const formattedBalance = ethers.formatUnits(balance, decimals);

        // 5. Подставляем в инпут по твоему ID 'stakeAmount'
        const input = document.getElementById('stakeAmount');
        if (input) {
            input.value = formattedBalance;

            // 6. Генерируем событие ввода, чтобы сразу сработал расчет наград (updateRewardCalc)
            input.dispatchEvent(new Event('input'));
        }

    } catch (e) {
        console.error("Error fetching MIRTA balance:", e);
    }
}



// ==========================================
// 3. ФУНКЦИИ КАЛЬКУЛЯТОРА (UI LOGIC)
// ==========================================

function updateRewardCalc() {
    const amountInput = document.getElementById('stakeAmount');
    const rewardSpan = document.getElementById('calculatedReward');
    const rewardHint = document.getElementById('stakeRewardCalc');

    if (!amountInput || !rewardSpan) return;
    const amount = parseFloat(amountInput.value) || 0;

    const tiers = [
        { name: "Flexible", apy: 10.5, days: 1 },
        { name: "7 Days", apy: 15, days: 7 },
        { name: "30 Days", apy: 18, days: 30 },
        { name: "90 Days", apy: 22.5, days: 90 }
    ];

    const currentTier = tiers[selectedTier] || tiers[0];

    if (amount > 0) {
        const yearly = (amount * currentTier.apy) / 100;
        const daily = yearly / 365;
        const totalForPeriod = daily * currentTier.days;
        const valueText = currentTier.days <= 1 ? daily.toFixed(2) : totalForPeriod.toFixed(2);
        const suffixText = currentTier.days <= 1
            ? ' MIRTA Daily Reward'
            : ` MIRTA Total Reward (${currentTier.name})`;

        const valueSpan = document.createElement('span');
        valueSpan.id = 'calculatedReward';
        valueSpan.textContent = valueText;

        if (currentTier.days <= 1) {
            rewardSpan.textContent = valueText;
            rewardHint.replaceChildren(document.createTextNode('~'), valueSpan, document.createTextNode(suffixText));
        } else {
            rewardSpan.textContent = valueText;
            rewardHint.replaceChildren(document.createTextNode('~'), valueSpan, document.createTextNode(suffixText));
        }
    } else {
        const valueSpan = document.createElement('span');
        valueSpan.id = 'calculatedReward';
        valueSpan.textContent = '0.00';

        rewardSpan.textContent = '0.00';
        rewardHint.replaceChildren(document.createTextNode('~'), valueSpan, document.createTextNode(' MIRTA Reward'));
    }
}

function calculateAndDisplayRewards() {
    const amountInput = document.getElementById('stakeAmount');
    const rewardDisplay = document.getElementById('rewardProjectionDisplay');

    if (!amountInput || !rewardDisplay) return;
    const amount = parseFloat(amountInput.value) || 0;

    const tiers = [
        { name: "Flexible", apy: 10.5, days: 1 },
        { name: "7 Days", apy: 15, days: 7 },
        { name: "30 Days", apy: 18, days: 30 },
        { name: "90 Days", apy: 22.5, days: 90 }
    ];

    const currentTier = tiers[selectedTier] || tiers[0];

    if (amount > 0) {
        const yearly = (amount * currentTier.apy) / 100;
        const daily = yearly / 365;
        const totalForPeriod = daily * currentTier.days;

        if (currentTier.days <= 1) {
            rewardDisplay.innerText = `~${daily.toFixed(2)} MIRTA Daily Reward`;
        } else {
            rewardDisplay.innerText = `~${totalForPeriod.toFixed(2)} MIRTA Total Reward (${currentTier.name})`;
        }
    } else {
        rewardDisplay.innerText = `~0,00 MIRTA Reward`;
    }
}



// ==========================================
// 4. ОСНОВНЫЕ БЛОКЧЕЙН-ОПЕРАЦИИ (STAKE/UNSTAKE)
// ==========================================

async function stakeTokens() {
    const amountInput = document.getElementById('stakeAmount').value;


    if (!/^\d*\.?\d+$/.test(amountInput) || Number(amountInput) <= 0) {
        return alert("Please enter an amount greater than 0");
    }


    if (!STAKING_ADDRESS || !MIRTA_TOKEN_ADDRESS) {
        return alert("Contract addresses not found. Please check your network connection.");
    }

    try {
        await ensureCorrectNetwork();

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();


        if (window.openModal) {
            window.openModal('loading', 'Preparing your staking transaction...');
        }


        const stakingContract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, signer);
        const tokenAbi = [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) external view returns (uint256)",
            "function balanceOf(address account) external view returns (uint256)"
        ];
        const tokenContract = new ethers.Contract(MIRTA_TOKEN_ADDRESS, tokenAbi, signer);

        const amountWei = ethers.parseUnits(amountInput, 18);

        const balance = await tokenContract.balanceOf(userAddress);
        if (balance < amountWei) {
            throw new Error(`Insufficient balance. You have ${ethers.formatUnits(balance, 18)} MIRTA`);
        }

        const allowance = await tokenContract.allowance(userAddress, STAKING_ADDRESS);
        if (allowance < amountWei) {
            if (window.openModal) {
                window.openModal('loading', 'Step 1/2: Approving MIRTA tokens. Please confirm in your wallet...');
            }
            const approveTx = await tokenContract.approve(STAKING_ADDRESS, amountWei);
            await approveTx.wait();
            console.log("Approval confirmed");
        }

        if (window.openModal) {
            window.openModal('loading', 'Step 2/2: Confirming stake in your wallet...');
        }

        const tx = await stakingContract.stake(amountWei, Number(selectedTier));

        if (window.openModal) {
            window.openModal('loading', 'Transaction sent! Finalizing on blockchain...', tx.hash);
        }

           await tx.wait();

        // 1. Получаем ID текущей сети
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        // 2. Отправляем в n8n с передачей chainId в метаданных
        await sendWeb3EventToN8n(
            userAddress,
            tx.hash,
            `Stake ${amountInput} MIRTA`,
            STAKING_ADDRESS,
            {
                chainId: chainId // <-- Теперь функция его подхватит
            }
        );

        if (window.openModal) {
            window.openModal('success', `Successfully staked ${amountInput} MIRTA! Your rewards start accumulating now.`, tx.hash);
        }


        if (typeof loadUserStakes === 'function') loadUserStakes();


    } catch (error) {
        console.error("Staking error:", error);

        if (error.code === 4001) {
            if (window.closeStatusModal) window.closeStatusModal();
            alert("Transaction rejected by user.");
        } else {
            const errorMessage = error.reason || error.message || "Staking failed. Please try again.";
            if (window.openModal) {
                window.openModal('error', errorMessage);
            }
        }
    }
}

async function unstake(tier) {
    try {
        // 1. Проверка инициализации
        if (!stakingContract) await initStaking();
        const userAddress = await globalSigner.getAddress();

        // Открываем модалку в режиме загрузки
        if (window.openModal) {
            window.openModal('loading', 'Reading stake data and calculating rewards...');
        }

        // 2. Получаем данные о стейке до транзакции (для финального отчета)
        const stakeData = await stakingContract.userStakes(userAddress, tier);
        const rewardAmount = await stakingContract.calculateReward(userAddress, tier);

        const amountLocked = ethers.formatUnits(stakeData.amount, 18);
        const amountReward = ethers.formatUnits(rewardAmount, 18);
        const totalAmount = (Number(amountLocked) + Number(amountReward)).toFixed(4);

        // 3. Запрос подписи в кошельке
        if (window.openModal) {
            window.openModal('loading', 'Please confirm the Unstake & Claim transaction in your wallet...');
        }

        const tx = await stakingContract.unstake(tier);

        // 4. Ожидание подтверждения
        if (window.openModal) {
            window.openModal('loading', 'Processing withdrawal... Your tokens are on the way.', tx.hash);
        }

        await tx.wait();

            const network = await provider.getNetwork();
            const chainId = Number(network.chainId); // Берем ID текущей сети

            // Отправляем в n8n
            await sendWeb3EventToN8n(
              userAddress,
              tx.hash,
              `Unstake ${totalAmount} MIRTA`,
              STAKING_ADDRESS,
              {
                  chainId: chainId, // <--- ЭТО ВАЖНО
                  // остальные поля...
              }
          );

        // 5. УСПЕХ (с твоим кастомным HTML-отчетом)
        if (window.openModal) {
            const successFragment = document.createDocumentFragment();

            const summary = document.createElement('p');
            summary.style.marginBottom = '15px';
            summary.textContent = 'Tokens and rewards successfully withdrawn!';

            const panel = document.createElement('div');
            panel.style.textAlign = 'left';
            panel.style.background = 'rgba(0,0,0,0.3)';
            panel.style.padding = '15px';
            panel.style.borderRadius = '12px';
            panel.style.border = '1px solid rgba(0,242,255,0.2)';

            const row1 = document.createElement('div');
            row1.style.display = 'flex';
            row1.style.justifyContent = 'space-between';
            row1.style.marginBottom = '8px';
            row1.style.fontSize = '14px';

            const label1 = document.createElement('span');
            label1.style.color = '#8a8d91';
            label1.textContent = 'Returned Deposit:';

            const value1 = document.createElement('span');
            value1.style.color = '#fff';
            value1.style.fontWeight = 'bold';
            value1.textContent = `${Number(amountLocked).toLocaleString()} MIRTA`;

            row1.appendChild(label1);
            row1.appendChild(value1);

            const row2 = document.createElement('div');
            row2.style.display = 'flex';
            row2.style.justifyContent = 'space-between';
            row2.style.color = '#00f2ff';
            row2.style.fontSize = '14px';

            const label2 = document.createElement('span');
            label2.textContent = 'Earned Reward:';

            const value2 = document.createElement('span');
            value2.style.fontWeight = 'bold';
            value2.textContent = `+${Number(amountReward).toFixed(4)} MIRTA`;

            row2.appendChild(label2);
            row2.appendChild(value2);

            const row3 = document.createElement('div');
            row3.style.marginTop = '10px';
            row3.style.borderTop = '1px solid #333';
            row3.style.paddingTop = '10px';
            row3.style.display = 'flex';
            row3.style.justifyContent = 'space-between';
            row3.style.fontWeight = 'bold';

            const label3 = document.createElement('span');
            label3.textContent = 'Total Received:';

            const value3 = document.createElement('span');
            value3.style.color = '#fff';
            value3.textContent = `${totalAmount}MIRTA`;

            row3.appendChild(label3);
            row3.appendChild(value3);

            panel.appendChild(row1);
            panel.appendChild(row2);
            panel.appendChild(row3);

            successFragment.appendChild(summary);
            successFragment.appendChild(panel);

            window.openModal('success', successFragment, tx.hash, {}, true);
        }

        // Обновляем список стейков на странице
        if (typeof loadUserStakes === 'function') loadUserStakes();

    } catch (e) {
        console.error("Unstake error:", e);

        if (e.code === 4001) {
            if (window.closeStatusModal) window.closeStatusModal();
            alert("Transaction rejected.");
        } else {
            const errorMsg = e.reason || e.message || "Unstake failed. Make sure the lock period has ended.";
            if (window.openModal) {
                window.openModal('error', errorMsg);
            }
        }
    }
}

// ==========================================
// 5. ОТОБРАЖЕНИЕ АКТИВНЫХ СТЕЙКОВ И ТАЙМЕРЫ
// ==========================================

async function loadUserStakes() {
    if (!globalSigner || !stakingContract) return;
    const container = document.getElementById('userStakesList');
    try {
        const user = await globalSigner.getAddress();
        const fragment = document.createDocumentFragment();
        const now = Math.floor(Date.now() / 1000);

        for (let i = 0; i < 4; i++) {
            const data = await stakingContract.userStakes(user, i);
            if (data.amount > 0n) {
                const reward = await stakingContract.calculateReward(user, i);
                const startTime = Number(data.startTime);
                const lockDuration = Number(data.lockDuration);
                const endTime = startTime + lockDuration;
                const isLocked = now < endTime;

                const card = document.createElement('div');
                card.className = 'active-stake-card';

                const mainInfo = document.createElement('div');
                mainInfo.className = 'stake-main-info';

                const planStat = document.createElement('div');
                planStat.className = 'stake-stat';
                const planLabel = document.createElement('label');
                planLabel.textContent = 'Plan';
                const planName = document.createElement('span');
                planName.className = 'plan-name';
                planName.textContent = plans[i].name;
                planStat.appendChild(planLabel);
                planStat.appendChild(planName);

                const amountStat = document.createElement('div');
                amountStat.className = 'stake-stat';
                const amountLabel = document.createElement('label');
                amountLabel.textContent = 'Staked Amount';
                const amountValue = document.createElement('span');
                amountValue.textContent = `${Number(ethers.formatUnits(data.amount, 18)).toLocaleString()} MIRTA`;
                amountStat.appendChild(amountLabel);
                amountStat.appendChild(amountValue);

                const rewardStat = document.createElement('div');
                rewardStat.className = 'stake-stat';
                const rewardLabel = document.createElement('label');
                rewardLabel.textContent = 'Earned Reward';
                const rewardValue = document.createElement('span');
                rewardValue.className = 'reward-value';
                rewardValue.textContent = `+${Number(ethers.formatUnits(reward, 18)).toFixed(4)}`;
                rewardStat.appendChild(rewardLabel);
                rewardStat.appendChild(rewardValue);

                mainInfo.appendChild(planStat);
                mainInfo.appendChild(amountStat);
                mainInfo.appendChild(rewardStat);

                if (isLocked) {
                    const unlockStat = document.createElement('div');
                    unlockStat.className = 'stake-stat';
                    const unlockLabel = document.createElement('label');
                    unlockLabel.textContent = 'Unlocks In';
                    const timer = document.createElement('span');
                    timer.className = 'countdown-timer';
                    timer.dataset.endtime = String(endTime);
                    timer.textContent = 'Loading...';
                    unlockStat.appendChild(unlockLabel);
                    unlockStat.appendChild(timer);
                    mainInfo.appendChild(unlockStat);
                }

                const action = document.createElement('div');
                action.className = 'stake-action';
                const button = document.createElement('button');
                button.className = 'unstake-btn-modern';
                if (isLocked) {
                    button.disabled = true;
                    button.textContent = 'Locked';
                } else {
                    button.textContent = 'Unstake & Claim';
                }
                button.onclick = () => unstake(i);
                action.appendChild(button);

                card.appendChild(mainInfo);
                card.appendChild(action);
                fragment.appendChild(card);
            }
        }
        if (fragment.childNodes.length === 0) {
            container.replaceChildren(document.createTextNode('No active stakes'));
        } else {
            container.replaceChildren(fragment);
        }
        startGlobalTimers();
    } catch (e) { console.error(e); }
}

function startGlobalTimers() {
    if (window.stakeTimerInterval) clearInterval(window.stakeTimerInterval);

    window.stakeTimerInterval = setInterval(() => {
        const timers = document.querySelectorAll('.countdown-timer');
        const now = Math.floor(Date.now() / 1000);

        timers.forEach(timer => {
            const endTime = parseInt(timer.getAttribute('data-endtime'));
            const timeLeft = endTime - now;

            if (timeLeft <= 0) {
                timer.innerText = "Unlocked!";
                timer.style.color = "#00f2ff";
            } else {
                const days = Math.floor(timeLeft / 86400);
                const hours = Math.floor((timeLeft % 86400) / 3600);
                const minutes = Math.floor((timeLeft % 3600) / 60);
                const seconds = timeLeft % 60;

                let timeStr = "";
                if (days > 0) timeStr += `${days}d `;
                timeStr += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                timer.innerText = timeStr;
            }
        });
    }, 1000);
}


// ==========================================
// 6. UI ИНТЕРФЕЙС И СОБЫТИЯ
// ==========================================

function initStakingUI() {
    const grid = document.getElementById('stakingPlans');
    if (!grid) return;
    const fragment = document.createDocumentFragment();

    plans.forEach(p => {
        const card = document.createElement('div');
        card.className = `plan-card ${p.id === selectedTier ? 'active' : ''}`;
        card.onclick = () => selectTier(p.id, card);

        const title = document.createElement('h4');
        title.textContent = p.name;

        const apy = document.createElement('span');
        apy.className = 'apy';
        apy.textContent = `${p.apy} APY`;

        card.appendChild(title);
        card.appendChild(apy);
        fragment.appendChild(card);
    });

    grid.replaceChildren(fragment);
}

function selectTier(id, element) {
    selectedTier = id;
    document.querySelectorAll('.plan-card').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    updateRewardCalc();
}

function closeStatusModal() {
    document.getElementById('statusModal').style.display = 'none';
}



// ==========================================
// 7. СЛУШАТЕЛИ СОБЫТИЙ И ЗАПУСК
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initStakingUI();
    const input = document.getElementById('stakeAmount');
    if (input) input.addEventListener('input', updateRewardCalc);
    if (window.ethereum) initStaking();
});

if (window.ethereum) {
    /** Перезагрузка страницы при смене сети */
    window.ethereum.on('chainChanged', () => window.location.reload());

    /** Перезагрузка страницы при смене аккаунта */
    window.ethereum.on('accountsChanged', () => window.location.reload());
}
