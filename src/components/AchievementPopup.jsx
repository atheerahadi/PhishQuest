import "../styles/achievementPopup.css";


function AchievementPopup({
  achievement,
  onClose
}) {

  if (!achievement) {

    return null;

  }


  return (

    <div className="achievement-overlay">

      <div className="achievement-popup">

        <div className="achievement-icon">

          {achievement.icon}

        </div>


        <h2>
          🎉 Tahniah!
        </h2>


        <h3>
          Anda memperoleh
        </h3>


        <h3>
          {achievement.name}
        </h3>


        <p>
          {achievement.description}
        </p>


        <div className="achievement-xp">

          ⭐ {achievement.xp} XP

        </div>


        <button
          className="achievement-close"
          onClick={onClose}
        >

          Teruskan 🚀

        </button>

      </div>

    </div>

  );

}


export default AchievementPopup;