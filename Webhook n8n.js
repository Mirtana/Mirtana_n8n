// 1. Укажи свой рабочий URL из n8n
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/7753538a-f7e2-483a-acae-94dc6b1843e7";


/*** Функция, которая вызывается ПОСЛЕ успешного взаимодействия с контрактом*/
async function sendWeb3EventToN8n(userAddress, txHash, actionName, contractAddress, metadata = {}) {
    // ВАЖНО: берем chainId именно из того объекта, что пришел, без подстановок по умолчанию
    const finalChainId = metadata.chainId;

    const payload = {
        form_type: "web3_interaction",
        wallet_address: userAddress,
        transaction_hash: txHash,
        action: actionName,
        contract_address: contractAddress,
        chainId: finalChainId,
        timestamp: new Date().toISOString()
    };

    // console.log("Отправляю в n8n этот payload:", payload);




    try {
        // console.log("Отправка Web3 данных в n8n...", payload);

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Данные кошелька успешно отправлены в Telegram через n8n!");
        } else {
            console.error("Ошибка n8n сервера при отправке Web3 события.");
        }
    } catch (error) {
        console.error("Ошибка сети при отправке вебхука:", error);
    }
}

