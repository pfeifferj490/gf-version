console.log("system check: js is linked");
const sidebar = document.getElementById('ltSidebar');
const toggleButton = document.getElementById('toggleButton');
const allPages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const closeButton = document.getElementById("closeButton");
function initApp() {
    console.log('app initializing');
}
initApp();
toggleButton.addEventListener('click', function() {
    toggleButton.classList.toggle('open');
    sidebar.classList.toggle('active');

});
navLinks.forEach(button => {
    button.onclick = function() {
        const target = button.getAttribute('data-target');

        allPages.forEach(p => p.style.display = 'none');
        document.getElementById(target).style.display = 'block';

        sidebar.classList.remove('active');
        toggleButton.classList.toggle('open');
    };
});

// quiz scoring
let totalScore = 0;

const quizButtons = document.querySelectorAll('.quiz-next-btn');
const resultArea = document.getElementById('results-area');

quizButtons.forEach(button => {
    button.addEventListener('click', function() {
        
        const currentStepNum = this.getAttribute('data-step');
        const currentStepEl = document.getElementById(`step${currentStepNum}`);
        console.log("button clicked looking for step:", currentStepNum);

        if (!currentStepEl){
            console.error("developer error: could not find an element with Id: step" + currentStepNum);
            return;
        }

        const selectedOption = currentStepEl.querySelector('input:checked');

        if (!selectedOption) {
            alert("Please select an answer!");
            return;
        }
        totalScore += parseInt(selectedOption.getAttribute('data-points'));

        if (currentStepNum === "1") {
            showStep(2);
        } else if (currentStepNum === "2") {
            displayFinalRecommendation();
        }
    });
});

function showStep(stepNumber) {
    document.querySelectorAll('.quiz-step').forEach(step => step.style.display = 'none');
    document.getElementById(`step${stepNumber}`).style.display = 'block';

    const totalQuestions = myQuestionsArray.length;
    let currentProgress = (stepNumber / totalQuestions) * 100;
    progressBar.style.width = `${currentProgress}%`;
}

function displayFinalRecommendation(){
    let finalCalculation = 0;
    const checkedOptions = document.querySelectorAll('input:checked');

    checkedOptions.forEach(option => {
        finalCalculation += parseInt(option.getAttribute('data-points'));
    });

    document.getElementById('step2').style.display = 'none';
    const resultsArea = document.getElementById('results-area');
    resultsArea.style.display = 'block';
    const title = document.getElementById('results-title');
    const text = document.getElementById('results-text');

    if (finalCalculation>= 15) {
        title.innerText = "Extremely Anxious";
        text.innerText = `Your score is ${finalCalculation}. Extremely Anxious indviduals scores range from 15 to 20.`;
        text.style.color = "#d9534f";
    } else if (finalCalculation>=8) {
        title.innerText = "Moderatley Anxious";
        text.innerText = `Your score is ${finalCalculation}. Moderately Anxious indviduals scores range from 8 to 14.`;
        text.style.color = "#f0ad4e";
    } else {
        title.innerText = "Minimally Anxious";
        text.innerText = `Your score is ${finalCalculation}. Minimally Anxious indviduals score range from 0 to 7.`;
        text.style.color = "#5cb85c";
    }
}

document.getElementById('restart-btn').addEventListener('click', function(){
    totalScore = 0;
    document.getElementById('results-area').style.display = 'none';
    showStep(1);
    const allRadios = document.querySelectorAll('input[type="radio"]');
    allRadios.forEach(radio => radio.checked = false);
});

const questionBank = [
    {
        question: "What is the best condiment?",
        options: [
            {text: "mustard", points: 0, category: "high"},
            {text: "ketchup", points: 5, category: "mid"},
            {text: "mayo", points: 10, category: "low"}
        ]
    },
    {
        question: "Which month is best?",
        options: [
            {text: "june", points: 0, category: "high"},
            {text: "october", points: 7, category: "low"}
        ]
    },
    {
        question: "What meat do you get on your burrito?",
        options: [
            {text: "chicken", points: 0, category: "high"},
            {text: "steak", points: 10, category: "low"},
            {text: "pork", points: 7, category: "mid"},
        ],
        noShuffle: true
    }
];

let currentIndex = 0;
let finalScore = 0;
let userAnswers = [];

function loadQuestion(){
    const currentData = questionBank[currentIndex];
    document.getElementById('display-question').innerText = currentData.question;
    const optionsContainer = document.getElementById('display-options');
    const backBtn = document.getElementById('back-btn');
    backBtn.style.display = (currentIndex === 0) ? 'none' : 'inline-block';
    optionsContainer.innerHTML = "";
    const displayOptions = currentData.noShuffle
        ? currentData.options
        : shuffleArray(currentData.options);
    
    displayOptions.forEach((option, index) => {
        const originalIndex = currentData.options.indexOf(option);
        const btn = document.createElement('button');
        btn.innerText = option.text;
        if(userAnswers[currentIndex] && userAnswers[currentIndex].choiceIndex === index){
            btn.classList.add('selected');
        }
        btn.className = "quiz-option-btn";
        btn.onclick = () => handleAnswer(index, option.points, option.category);
        optionsContainer.appendChild(btn);
    });

    updateProgressBar();
}
 function handleAnswer(optionIndex, points, categoryName){
        userAnswers[currentIndex] = {
            choiceIndex: optionIndex,
            score: points,
            category: categoryName
        };
        moveToNext();
    }
function moveToNext(){
    currentIndex++;
    if (currentIndex < questionBank.length){
        loadQuestion();
    } else {
        showFullResults();
    }
}
function moveToBack(){
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
    }
}
function updateProgressBar(){
    const progress = (currentIndex / questionBank.length) * 100;
    document.getElementById('fullprogress-bar-fill').style.width = `${progress}%`;
} 
function showFullResults (){
    const counts = {};
    userAnswers.forEach(answer => {
        const cat = answer. category;
        counts[cat] = (counts[cat] || 0) + 1;
    });
    console.log(counts);
    displayFinalText(counts);
}
function displayFinalText(counts) {
    document.getElementById('fullprogress-bar-fill').style.width = "100%";
    const finalScore = userAnswers.reduce((sum, answer) => sum + answer.score, 0);
    document.getElementById('question-screen').style.display = 'none';
    const fullresultsArea = document.getElementById('fullresults-area');
    fullresultsArea.style.display = 'block';
    const title = document.getElementById('fullresults-title');
    const text = document.getElementById('fullresults-text');

    text.innerHTML = `Your final score is <b>${finalScore}</b>. You chose <b>${counts.high || 0}</b> high intelligence options, <b>${counts.mid || 0}</b> medium intelligence optiosn, and <b>${counts.low || 0}</b> low intelligence options.`;

    if (finalScore >= 5) {
        title.innerText = "low intelligence";
        title.style.color = "#f0ad4e";
    } else {
        title.innerText = "high intellignece";
        title.style.color = "#5cb85c";
    }
}
function restartQuiz() {
    currentIndex = 0;
    userAnswers = [];
    updateProgressBar();
    document.getElementById('fullresults-area').style.display = 'none';
    document.getElementById('question-screen').style.display = 'block';
    loadQuestion();
}
function shuffleArray(array){
    let shuffled = [...array];
    for (let i = shuffled.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled [i]];
    }
    return shuffled;
}
loadQuestion()

console.log('js setup complete');