let character = {};

function showStep(current, next) {
  document.getElementById(current).classList.add("hidden");
  document.getElementById(next).classList.remove("hidden");
}

document.getElementById("toStep2").addEventListener("click", function() {
  character.name = document.getElementById("name").value;
  character.race = document.getElementById("race").value;
  character.class = document.getElementById("class").value;
  character.level = document.getElementById("level").value;

  showStep("step1", "step2");
});

document.getElementById("toStep3").addEventListener("click", function() {
  character.stats = {
    str: document.getElementById("str").value,
    dex: document.getElementById("dex").value,
    con: document.getElementById("con").value,
    int: document.getElementById("int").value,
    wis: document.getElementById("wis").value,
    cha: document.getElementById("cha").value
  };

  showStep("step2", "step3");
});

document.getElementById("backTo1").addEventListener("click", function() {
  showStep("step2", "step1");
});

document.getElementById("backTo2").addEventListener("click", function() {
  showStep("step3", "step2");
});

document.getElementById("finish").addEventListener("click", function() {
  character.hp = {
    max: document.getElementById("maxHp").value,
    current: document.getElementById("currentHp").value
  };

  character.mp = document.getElementById("mp").value;

  localStorage.setItem("character", JSON.stringify(character));

  displayCharacter();
  showStep("step3", "final");
});

function displayCharacter() {
  const saved = JSON.parse(localStorage.getItem("character"));
  const display = document.getElementById("characterDisplay");

  display.innerHTML = `
    <h3>${saved.name}</h3>
    <p>${saved.race} ${saved.class} - Level ${saved.level}</p>
    <hr>
    <p><strong>Stats:</strong></p>
    <p>STR: ${saved.stats.str}</p>
    <p>DEX: ${saved.stats.dex}</p>
    <p>CON: ${saved.stats.con}</p>
    <p>INT: ${saved.stats.int}</p>
    <p>WIS: ${saved.stats.wis}</p>
    <p>CHA: ${saved.stats.cha}</p>
    <hr>
    <p>HP: ${saved.hp.current} / ${saved.hp.max}</p>
    <p>MP: ${saved.mp}</p>
  `;
}