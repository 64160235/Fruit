function startGame() {
    setTimeout(() => {
        window.location.href = 'SplitGame.html';  
    }, 800);  
}

function Tutorial1() {
    setTimeout(() => {
        window.location.href = 'Tutorial1.html';  
    }, 800);  
}

function Tutorial2() {
    setTimeout(() => {
        window.location.href = 'Tutorial2.html';  
    }, 800); 
}
function Game1() {
    setTimeout(() => {
        window.location.href = 'Game1.html';  
    }, 800);
}

function Game2() {
    setTimeout(() => {
        window.location.href = 'Game2.html';  
    }, 800); 
}

function Shop() {
    setTimeout(() => {
        window.location.href = 'Shop.html';  
    }, 800);
}

let currentAnswer = "";
let currentLevel = 1;
let score = 0;
let timeLeft = 10;  // กำหนดเวลาเริ่มต้นเป็น 30 วินาที
let timer;  // เก็บ ID ของ setInterval
 // ตัวแปรเก็บสถานะการใช้ไอเทมในเลเวลปัจจุบัน
let usedItemsInLevel = {
    lightbulb: false,
    hourglass: false
};


// รายการผลไม้แยกตามเลเวล
const levelFruits = {
    1: [
        { name: "ส้ม", image: "orange.png", choices: ["แอปเปิ้ล", "ส้ม", "กล้วย", "องุ่น"] },
        { name: "แอปเปิ้ล", image: "apple.png", choices: ["แอปเปิ้ล", "ทุเรียน", "มะละกอ", "ฝรั่ง"] },
        { name: "กล้วย", image: "banana.png", choices: ["แตงโม", "สับปะรด", "กล้วย", "มังคุด"] }
    ],
    2: [
        { name: "องุ่น", image: "grape.png", choices: ["องุ่น", "สับปะรด", "กล้วย", "มังคุด"] },
        { name: "ทุเรียน", image: "durian.png", choices: ["เงาะ", "มังคุด", "ทุเรียน", "ลองกอง"] },
        { name: "มะพร้าว", image: "coconut.png", choices: ["เงาะ", "มังคุด", "มะพร้าว", "ลองกอง"] }
    ],
    3: [
        { name: "แตงโม", image: "watermelon.png", choices: ["แอปเปิ้ล", "แตงโม", "ฝรั่ง", "ลำไย"] },
        { name: "สับปะรด", image: "pineapple.png", choices: ["มะละกอ", "แตงโม", "สับปะรด", "องุ่น"] },
        { name: "ฝรั่ง", image: "foreigner.png", choices: ["ส้ม", "ฝรั่ง", "สับปะรด", "องุ่น"] }
    ]
};

// รายการโจทย์แยกตามระดับ
const levelProblems = {
    1: [
        { question: "พี่ให้แอปเปิ้ลน้องมา 3 ผล และแม่ให้เพิ่มอีก 5 ผล น้องมีแอปเปิ้ลทั้งหมดกี่ผล?", answer: "8", hint: "3+5" },
        { question: "น้องสาวซื้อกล้วยหอมราคา 2 บาท และแม่ให้เงินเพิ่มอีก 4 บาท น้องสาวมีเงินทั้งหมดกี่บาท?", answer: "6", hint: "2+4" },
        { question: "ต้นไม้มีมะม่วงอยู่ 6 ผล หล่นไปอีก 3 ผล ตอนนี้ต้นไม้มีมะม่วงอยู่กี่ผล?", answer: "3", hint: "6-3" }
    ],
    2: [
        { question: "แมวส้มเจอมะละกอ 5 ผลในสวน และพ่อให้เพิ่มอีก 7 ผล แมวส้มมีมะละกอทั้งหมดกี่ผล?", answer: "12" , hint: "5+7"},
        { question: "แม่ให้เงินน้องชาย 10 บาท น้องชายใช้เงินซื้อสับปะรดไป 4 บาท ตอนนี้น้องชายเหลือเงินกี่บาท?", answer: "6", hint: "10-4" },
        { question: "ตะกร้ามีส้มทั้งหมด 8 ผล น้องเอาส้มออกไป 2 ผล แล้วเก็บส้มมาเพิ่มอีก 3 ผล ตอนนี้ในตะกร้ามีส้มทั้งหมดกี่ผล?", answer: "9", hint: "8-2+3" }
    ],
    3: [
        { question: "พ่อให้เงินลูกชาย 12 บาท แม่ให้เพิ่มอีก 15 บาท ลูกชายซื้อแตงโมไป 8 บาท ตอนนี้ลูกชายเหลือเงินกี่บาท?", answer: "19", hint: "12+15-8" },
        { question: "มีองุ่นอยู่ 18 พวง พี่กินไป 5 พวง และน้องกินไปอีก 7 พวง ตอนนี้เหลือองุ่นกี่พวง?", answer: "6" , hint: "18-5-7"},
        { question: "ต้นไม้มีมะพร้าวอยู่ 20 ลูก หล่นไป 6 ลูก และพี่ชายเก็บเพิ่มมาอีก 10 ลูก ตอนนี้ต้นไม้มีมะพร้าวทั้งหมดกี่ลูก?", answer: "24", hint: "20-6+10" }
    ]
};
// ฟังก์ชันสุ่มคำถามใหม่และรีเซ็ตการใช้งานไอเทม
function randomizeQuestion() {
    startTimer();
    resetItemUsage1();  // รีเซ็ตการใช้งานไอเทมเมื่อเริ่มเลเวลใหม่
    restoreChoices();  // เรียกฟังก์ชันคืนค่าตัวเลือก
    const fruitList = levelFruits[currentLevel] || [];
    if (fruitList.length === 0) {
        document.getElementById("result").innerText = "คุณผ่านทุกเลเวลแล้ว!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * fruitList.length);
    const fruit = fruitList[randomIndex];
    currentAnswer = fruit.name;
    document.getElementById("fruitImage").src = "./image/" + fruit.image;

    let choices = [...fruit.choices];
    choices = shuffleArray(choices);

    const buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach((btn, index) => {
        btn.innerText = choices[index];
        btn.style.visibility = "visible";  // ทำให้ตัวเลือกกลับมาแสดง
        btn.onclick = function () {
            checkAnswer(btn);
        };
    });

    document.getElementById("result").innerText = "";
}

// ฟังก์ชันคืนค่าตัวเลือกที่ถูกซ่อน
function restoreChoices() {
    const buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach(btn => {
        btn.style.visibility = "visible";  // ทำให้ตัวเลือกที่ถูกซ่อนแสดงกลับมา
    });
}

// ฟังก์ชันสุ่มโจทย์คำถามตามระดับ2
function randomizeQuestionTextInput() {
    startTimerGame2();  // เริ่มจับเวลาเมื่อเริ่มคำถามใหม่
    resetItemUsage();
    hideHint();  // ซ่อนคำใบ้เมื่อเริ่มเลเวลใหม่
    const problemList = levelProblems[currentLevel] || [];  // ดึงรายการโจทย์ของเลเวลปัจจุบัน
    if (problemList.length === 0) {
        document.getElementById("result").innerText = "คุณผ่านทุกเลเวลแล้ว!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * problemList.length);
    const problem = problemList[randomIndex];
    currentAnswer = problem.answer;
    document.getElementById("questionDisplay").innerText = problem.question;

    // ล้างข้อความเก่าที่กรอกไว้
    document.getElementById("answerInput").value = "";
    document.getElementById("result").innerText = "";
}

function hideHint() {
    const hintDisplay = document.getElementById("hintDisplay");
    hintDisplay.innerText = "";  // ลบคำใบ้ที่แสดงอยู่
}


// ตรวจสอบคำตอบเมื่อผู้ใช้เลือกตัวเลือก
function checkAnswer(selectedButton) {
    const selectedAnswer = selectedButton.innerText;
    const resultElement = document.getElementById("result");
    const levelDisplay = document.getElementById("levelDisplay");

    if (selectedAnswer === currentAnswer) {
        playCorrectSound();
        resultElement.innerText = "ถูกต้อง! 🎉";
        resultElement.style.color = "green";
        score++;  // เพิ่มคะแนนเมื่อเลือกถูกต้อง

        // ตรวจสอบว่าถึงเลเวลสุดท้ายหรือยัง
        if (currentLevel < Object.keys(levelFruits).length) {
            currentLevel++;
            levelDisplay.innerText = "Level " + currentLevel;
            setTimeout(() => {
                randomizeQuestion();
            }, 1000);
        } else {
            resultElement.innerText = "ยินดีด้วย! คุณผ่านทุกเลเวลแล้ว!";
            setTimeout(goToScorePage, 2000);  // ดีเลย์ 3 วิก่อนเปลี่ยนหน้า
        }
    } else {
        playWrongSound();
        resultElement.innerText = "ไม่ถูกต้อง ไว้ตาหน้าเอาใหม่!";
        resultElement.style.color = "red";
        setTimeout(goToScorePage, 2000);  // ดีเลย์ 3 วิก่อนเปลี่ยนหน้าเมื่อผิด
    }
}

// ฟังก์ชันตรวจสอบคำตอบจากการกรอก
function checkAnswerGame2() {
    const userAnswer = document.getElementById("answerInput").value.trim();
    const resultElement = document.getElementById("result");
    const levelDisplay = document.getElementById("levelDisplay");

    if (userAnswer === currentAnswer) {
        playCorrectSound();
        resultElement.innerText = "ถูกต้อง! 🎉";
        resultElement.style.color = "green";
        score++;  // เพิ่มคะแนนเมื่อเลือกถูกต้อง

        // ตรวจสอบว่าถึงเลเวลสุดท้ายหรือยัง
        if (currentLevel < Object.keys(levelProblems).length) {
            currentLevel++;
            levelDisplay.innerText = "Level " + currentLevel;
            setTimeout(() => {
                randomizeQuestionTextInput();
            }, 1000);
        } else {
            resultElement.innerText = "ยินดีด้วย! คุณผ่านทุกเลเวลแล้ว!";
            setTimeout(goToScorePage, 2000);  // ดีเลย์ 2 วิก่อนเปลี่ยนหน้า
        }
    } else {
        playWrongSound();
        resultElement.innerText = "ไม่ถูกต้อง ไว้ตาหน้าเอาใหม่!";
        resultElement.style.color = "red";
        setTimeout(goToScorePage, 2000);  // ดีเลย์ 2 วิก่อนเปลี่ยนหน้าเมื่อผิด
    }
}

// ฟังก์ชันเปลี่ยนหน้าไปยังหน้า Score และส่งคะแนนไปด้วย
function goToScorePage() {
    // ดึงคะแนนสะสมทั้งหมดจาก localStorage ถ้ามี ถ้าไม่มีให้เริ่มที่ 0
    let totalScore = localStorage.getItem("scoreAll") ? parseInt(localStorage.getItem("scoreAll")) : 0;

    // เพิ่มคะแนนรอบนี้เข้าไปในคะแนนสะสม
    totalScore += score;

    // บันทึกคะแนนสะสมใหม่ลง localStorage (ใช้สำหรับร้านค้า)
    localStorage.setItem("scoreAll", totalScore);

    // บันทึกคะแนนรอบล่าสุดเพื่อแสดงในหน้า Score
    localStorage.setItem("finalScore", score);

    // ไปยังหน้าแสดงคะแนน
    window.location.href = "Score.html";
}


// ฟังก์ชันสับเปลี่ยนตำแหน่งตัวเลือก
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ฟังก์ชันเริ่มตัวจับเวลา
function startTimer() {
    clearInterval(timer);  // เคลียร์ timer ก่อนเริ่มใหม่
    timeLeft = 10;  // รีเซ็ตเวลาในแต่ละด่าน
    document.getElementById("timerDisplay").innerText = `เวลา: ${timeLeft} วินาที`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timerDisplay").innerText = `เวลา: ${timeLeft} วินาที`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("result").innerText = "หมดเวลา! คุณแพ้แล้ว!";
            document.getElementById("result").style.color = "red";
            
            setTimeout(goToScorePage, 2000);  // รอ 2 วินาทีแล้วไปหน้าแสดงคะแนน
        }
    }, 1000);  // นับเวลาทุก ๆ 1 วินาที
}

function startTimerGame2() {
    clearInterval(timer);
    timeLeft = 20;
    document.getElementById("timerDisplay").innerText = `เวลา: ${timeLeft} วินาที`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timerDisplay").innerText = `เวลา: ${timeLeft} วินาที`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("result").innerText = "หมดเวลา! คุณแพ้แล้ว!";
            document.getElementById("result").style.color = "red";

            setTimeout(goToScorePage, 2000);
        }
    }, 1000);
}

//เรียกใช้งานเมื่อหน้าเว็บโหลดเสร็จ
window.onload = function() {
    const currentPage = window.location.pathname.split('/').pop(); // ดึงชื่อไฟล์ของหน้าเว็บปัจจุบัน
    if (currentPage === "Game1.html") {
        // ถ้าอยู่ในหน้าเกมแรก
        randomizeQuestion();
        showAvailableItems();
    } else if (currentPage === "Game2.html") {
        // ถ้าอยู่ในหน้าเกมที่สอง
        randomizeQuestionTextInput();
        showAvailableItems();
    } else {
        console.error("ไม่พบฟังก์ชันที่ต้องการเรียกสำหรับหน้านี้");
    }
};


// ฟังก์ชันเมื่อคลิกปุ่ม "ซื้อ"
const buyButtons = document.querySelectorAll(".buy-btn");
buyButtons.forEach(button => {
    button.addEventListener("click", () => {
        const itemPrice = parseInt(button.getAttribute("data-price"));
        const itemName = button.getAttribute("data-item");
        const resultDisplay = document.getElementById("purchaseResult");

        if (playerScore >= itemPrice) {
            playerScore -= itemPrice; // หักคะแนน
            scoreDisplay.innerText = playerScore;
            resultDisplay.innerText = `คุณซื้อ ${itemName} สำเร็จ! 🎉`;
            resultDisplay.style.color = "green";
            

            // เก็บคะแนนที่เหลือใน Local Storage
            localStorage.setItem("finalScore", playerScore);

            // บันทึกไอเท็มที่ซื้อไว้ใน Local Storage
            let purchasedItems = JSON.parse(localStorage.getItem("purchasedItems")) || [];
            purchasedItems.push(itemName);
            localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));
        } else {
            resultDisplay.innerText = `คะแนนของคุณไม่เพียงพอสำหรับ ${itemName}! 😞`;
            resultDisplay.style.color = "red";
        }
1    });
});



// ดึงคะแนนสะสมทั้งหมดจาก localStorage
let scoreAll = localStorage.getItem("scoreAll");
scoreAll = scoreAll ? parseInt(scoreAll) : 0;

// ดึงข้อมูลการซื้อไอเท็มจาก localStorage
let purchasedItems = JSON.parse(localStorage.getItem("purchasedItems")) || {
    lightbulb: 0,
    hourglass: 0
};

// ฟังก์ชันแสดงคะแนนสะสม
document.getElementById("scoreAllDisplay").innerText = 
    + scoreAll + " คะแนน";

// ฟังก์ชันกลับไปหน้าก่อนหน้านี้
function goBack() {
    playSound('sound/button.mp3');  // เล่นเสียงปุ่มกด
    setTimeout(() => {
        window.history.back();  // ย้อนกลับไปหน้าก่อนหน้านี้หลังจากดีเลย์ 1 วินาที
    }, 800);
}

// ฟังก์ชันสำหรับซื้อไอเท็ม
function purchaseItem(item, points) {
    const totalPurchases = purchasedItems.lightbulb + purchasedItems.hourglass;

    if (totalPurchases >= 3) {
        alert("คุณซื้อไอเท็มครบ 3 ครั้งแล้ว");
        return;
    }

    if (scoreAll >= points) {
        scoreAll -= points; // หักคะแนน
        purchasedItems[item]++; // เพิ่มจำนวนการซื้อของไอเท็ม

        // อัปเดตข้อมูลใน localStorage
        localStorage.setItem("scoreAll", scoreAll);
        localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));

        // อัปเดตคะแนนบนหน้าจอ
        document.getElementById("scoreAllDisplay").innerText = 
             + scoreAll + " คะแนน";

        // อัปเดตการแสดงผลไอเท็มที่ซื้อ
        displayPurchasedItems();

        playItemSound()

    } else {
        alert("คะแนนของคุณไม่เพียงพอ");
        playWrongSound()
    }
}

// ฟังก์ชันแสดงไอเท็มที่ซื้อ
function displayPurchasedItems() {
    const purchasedItemsDisplay = document.getElementById("purchasedItemsDisplay");
    purchasedItemsDisplay.innerHTML = ""; // ล้างข้อมูลเดิม

    if (purchasedItems.lightbulb > 0) {
        for (let i = 0; i < purchasedItems.lightbulb; i++) {
            const img = document.createElement("img");
            img.src = "image/lightbulb.png";
            img.alt = "หลอดไฟ";
            img.className = "purchased-item";
            purchasedItemsDisplay.appendChild(img);
        }
    }

    if (purchasedItems.hourglass > 0) {
        for (let i = 0; i < purchasedItems.hourglass; i++) {
            const img = document.createElement("img");
            img.src = "image/hourglass.png";
            img.alt = "นาฬิกาทราย";
            img.className = "purchased-item";
            purchasedItemsDisplay.appendChild(img);
        }
    }
}

// ฟังก์ชันรีเซ็ตไอเท็มที่ซื้อ
function resetItems() {
    if (confirm("คุณต้องการรีเซ็ตไอเท็มทั้งหมดหรือไม่?")) {
        purchasedItems = { lightbulb: 0, hourglass: 0 }; // รีเซ็ตข้อมูล
        localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));

        // คืนคะแนนสะสมทั้งหมด
        scoreAll = 0;
        localStorage.setItem("scoreAll", scoreAll);

        // อัปเดตคะแนนและไอเท็มที่ซื้อบนหน้าจอ
        document.getElementById("scoreAllDisplay").innerText = 
             + scoreAll + " คะแนน";
        displayPurchasedItems();

        alert("ไอเท็มถูกรีเซ็ตเรียบร้อยแล้ว");
    }
}

// เรียกฟังก์ชันแสดงไอเท็มที่ซื้อเมื่อโหลดหน้า
displayPurchasedItems();

// ฟังก์ชันสำหรับใช้ไอเทม
function useItem(item) {
    const resultElement = document.getElementById("result");

    if (usedItemsInLevel[item]) {
        resultElement.innerText = `คุณได้ใช้ไอเทมนี้ใน Level ${currentLevel} ไปแล้ว!`;
        resultElement.style.color = "red";
        return;  // ไม่ให้ใช้ซ้ำ
    }

    if (item === "hourglass") {
        playItemSound()
        timeLeft += 10;
        document.getElementById("timerDisplay").innerText = `เวลา: ${timeLeft} วินาที`;
        resultElement.innerText = "คุณใช้ไอเทมนาฬิกาทราย! เวลาถูกเพิ่มขึ้น 10 วินาที";
        resultElement.style.color = "green";
    } else if (item === "lightbulb") {
        const currentPage = window.location.pathname.split('/').pop();

        if (currentPage === "Game1.html") {
            playItemSound()
            removeRandomWrongChoice();
        } else if (currentPage === "Game2.html") {
            playItemSound()
            showHintForQuestion();
        }
    }

    usedItemsInLevel[item] = true;
    removeItemFromInventory(item);
    showAvailableItems();
}


// ฟังก์ชันรีเซ็ตการใช้งานไอเทมเมื่อขึ้นเลเวลใหม่
function resetItemUsage() {
    usedItemsInLevel = {
        lightbulb: false,
        hourglass: false
    };
    hideHint();  // ซ่อนคำใบ้เมื่อขึ้นเลเวลใหม่
}

// ฟังก์ชันรีเซ็ตการใช้งานไอเทมเมื่อขึ้นเลเวลใหม่
function resetItemUsage1() {
    usedItemsInLevel = {
        lightbulb: false,
        hourglass: false
    };
}


// ฟังก์ชันสุ่มลบตัวเลือกที่ผิดออก 1 ตัวเลือกใน Game1
function removeRandomWrongChoice() {
    const buttons = document.querySelectorAll(".choice-btn");
    let wrongChoices = [];

    buttons.forEach(btn => {
        if (btn.innerText !== currentAnswer) {
            wrongChoices.push(btn);
        }
    });

    if (wrongChoices.length > 0) {
        const randomIndex = Math.floor(Math.random() * wrongChoices.length);
        wrongChoices[randomIndex].style.visibility = "hidden";
        document.getElementById("result").innerText = "คุณใช้ไอเทมหลอดไฟ! ลบตัวเลือกที่ผิดออก 1 ตัวเลือก";
        document.getElementById("result").style.color = "green";
    } else {
        document.getElementById("result").innerText = "ไม่มีตัวเลือกที่ผิดให้ลบแล้ว!";
        document.getElementById("result").style.color = "red";
    }
}


// ฟังก์ชันแสดงคำใบ้สำหรับโจทย์ใน Game2
function showHintForQuestion() {
    const currentQuestion = document.getElementById("questionDisplay").innerText;
    const hintDisplay = document.getElementById("hintDisplay");

    const problemList = levelProblems[currentLevel];
    const foundProblem = problemList.find(problem => problem.question === currentQuestion);

    if (foundProblem && foundProblem.hint) {
        hintDisplay.innerText = `คำใบ้: ${foundProblem.hint}`;
        hintDisplay.style.color = "blue";
    } else {
        hintDisplay.innerText = "ไม่มีคำใบ้สำหรับคำถามนี้";
        hintDisplay.style.color = "red";
    }
}


// ฟังก์ชันลบไอเทมออกจาก inventory หลังจากใช้
function removeItemFromInventory(item) {
    let purchasedItems = JSON.parse(localStorage.getItem("purchasedItems")) || { lightbulb: 0, hourglass: 0 };

    if (purchasedItems[item] > 0) {
        purchasedItems[item]--;  // ลบจำนวนที่ใช้ไป 1 ชิ้น
        localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));

    } else {
        alert("คุณไม่มีไอเทมนี้แล้ว");
    }
}
// ฟังก์ชันแสดงรายการไอเทมที่ผู้เล่นซื้อ
function showAvailableItems() {
    const inventoryDiv = document.getElementById("playerItems");
    inventoryDiv.innerHTML = ""; // ล้างเนื้อหาก่อนหน้า

    // ใช้ Flexbox สำหรับจัดเรียงไอเทม
    inventoryDiv.style.display = "flex";
    inventoryDiv.style.gap = "10px"; // ระยะห่างระหว่างรูปภาพ
    inventoryDiv.style.flexWrap = "wrap"; // ให้ไอเทมขึ้นบรรทัดใหม่เมื่อพื้นที่ไม่พอ

    let purchasedItems = JSON.parse(localStorage.getItem("purchasedItems")) || { lightbulb: 0, hourglass: 0 };

    // แสดงรูปหลอดไฟ
    if (purchasedItems.lightbulb > 0) {
        for (let i = 0; i < purchasedItems.lightbulb; i++) {
            const img = document.createElement("img");
            img.src = "image/lightbulb.png"; // URL รูปภาพหลอดไฟ
            img.alt = "หลอดไฟ";
            img.title = "ใช้ หลอดไฟ"; // Tooltip เมื่อชี้เมาส์
            img.style.cursor = "pointer";
            img.style.width = "50px"; // ขนาดรูปภาพ
            img.style.height = "50px";

            // เพิ่ม event listener สำหรับการคลิก
            img.onclick = function () {
                useItem('lightbulb');
            };

            inventoryDiv.appendChild(img);
        }
    }

    // แสดงรูปลูกนาฬิกาทราย
    if (purchasedItems.hourglass > 0) {
        for (let i = 0; i < purchasedItems.hourglass; i++) {
            const img = document.createElement("img");
            img.src = "image/hourglass.png"; // URL รูปภาพนาฬิกาทราย
            img.alt = "นาฬิกาทราย";
            img.title = "ใช้ นาฬิกาทราย"; // Tooltip เมื่อชี้เมาส์
            img.style.cursor = "pointer";
            img.style.width = "50px"; // ขนาดรูปภาพ
            img.style.height = "50px";

            // เพิ่ม event listener สำหรับการคลิก
            img.onclick = function () {
                useItem('hourglass');
            };

            inventoryDiv.appendChild(img);
        }
    }

    // กรณีไม่มีไอเทม
    if (purchasedItems.lightbulb === 0 && purchasedItems.hourglass === 0) {
        inventoryDiv.innerHTML = "<p>คุณไม่มีไอเทม</p>";
    }
}





// ฟังก์ชันเล่นเสียง
function playSound(soundFile) {
    let audio = new Audio(soundFile);
    audio.play();
}

// ฟังก์ชันเล่นเสียงเมื่อตอบถูก
function playCorrectSound() {
    playSound('sound/correct.mp3');
}

function playWrongSound() {
    playSound('sound/wrong.mp3');
}

// ฟังก์ชันเล่นเสียงเมื่อใช้ไอเทม
function playItemSound() {
    playSound('sound/item.mp3');
}

function playGameSound() {
    playSound('sound/gamemusic.mp3');
}

function playButtonSound() {
    playSound('sound/button.mp3');
}



function resetScoreAll() {
    if (confirm("คุณต้องการรีเซ็ตคะแนน ScoreAll ทั้งหมดหรือไม่?")) {
        // รีเซ็ตคะแนนใน localStorage
        scoreAll = 0;
        localStorage.setItem("scoreAll", scoreAll);

        // อัปเดตการแสดงคะแนนบนหน้าจอ
        document.getElementById("scoreAllDisplay").innerText = scoreAll + " คะแนน";

        alert("รีเซ็ตคะแนนเรียบร้อยแล้ว!");
    }
}