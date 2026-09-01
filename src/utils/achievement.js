const achievements = [

  {
    xp: 100,
    name: "Penyiasat Siber",
    icon: "🛡️",
    description:
      "Anda telah mencapai 100 XP! Teruskan usaha untuk menjadi Wira Siber."
  },

  {
    xp: 200,
    name: "Wira Siber",
    icon: "🏆",
    description:
      "Hebat! Anda telah mencapai 200 XP dan kini bergelar Wira Siber."
  },

  {
    xp: 500,
    name: "Master Siber",
    icon: "👑",
    description:
      "Tahniah! Anda telah mencapai 500 XP dan menjadi Master Siber."
  }

];


export function getNewAchievement(
  oldXP,
  newXP
) {

  const unlocked = achievements

    .filter(
      (achievement) =>
        oldXP < achievement.xp &&
        newXP >= achievement.xp
    )

    .sort(
      (a, b) =>
        b.xp - a.xp
    );


  if (unlocked.length === 0) {

    return null;

  }


  return unlocked[0];

}


export default achievements;