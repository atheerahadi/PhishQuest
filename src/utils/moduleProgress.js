import { supabase } from "../services/supabase";


export async function completeModule(
  moduleId,
  moduleName,
  moduleXP = 50
) {

  try {

    // =========================
    // GET CURRENT USER
    // =========================

    const {
      data: {
        user
      },
      error: userError
    } = await supabase.auth.getUser();


    if (userError || !user) {

      console.error(
        "User tidak dijumpai:",
        userError
      );

      return {
        success: false,
        error: "User tidak dijumpai."
      };

    }


    // =========================
    // CHECK EXISTING PROGRESS
    // =========================

    const {
      data: existingProgress,
      error: checkError
    } = await supabase
      .from("module_progress")
      .select("completed")
      .eq("profile_id", user.id)
      .eq("module_id", moduleId)
      .maybeSingle();


    if (checkError) {

      console.error(
        "Module progress check error:",
        checkError
      );

      return {
        success: false,
        error: checkError
      };

    }


    // =========================
    // ALREADY COMPLETED
    // =========================

    if (existingProgress?.completed) {

      return {

        success: true,

        alreadyCompleted: true,

        oldXP: null,

        newXP: null

      };

    }


    // =========================
    // SAVE MODULE PROGRESS
    // =========================

    const {
      error: progressError
    } = await supabase
      .from("module_progress")
      .upsert(
        {
          profile_id: user.id,
          module_id: moduleId,
          module_name: moduleName,
          completed: true,
          completed_at: new Date().toISOString()
        },
        {
          onConflict: "profile_id,module_id"
        }
      );


    if (progressError) {

      console.error(
        "Module progress save error:",
        progressError
      );

      return {

        success: false,

        error: progressError

      };

    }


    // =========================
    // GET CURRENT XP
    // =========================

    const {
      data: profile,
      error: profileError
    } = await supabase
      .from("profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();


    if (profileError) {

      console.error(
        "Profile XP error:",
        profileError
      );

      return {

        success: false,

        error: profileError

      };

    }


    // =========================
    // OLD XP
    // =========================

    const oldXP =
      profile?.total_xp || 0;


    // =========================
    // NEW XP
    // =========================

    const newXP =
      oldXP + moduleXP;


    // =========================
    // UPDATE XP
    // =========================

    const {
      error: xpError
    } = await supabase
      .from("profiles")
      .update({
        total_xp: newXP
      })
      .eq("id", user.id);


    if (xpError) {

      console.error(
        "XP update error:",
        xpError
      );

      return {

        success: false,

        error: xpError

      };

    }


    // =========================
    // SUCCESS
    // =========================

    console.log(
      `Module ${moduleId} completed. XP: ${oldXP} → ${newXP}`
    );


    return {

      success: true,

      alreadyCompleted: false,

      oldXP: oldXP,

      newXP: newXP,

      moduleId: moduleId,

      moduleName: moduleName,

      moduleXP: moduleXP

    };


  } catch (error) {

    console.error(
      "Complete module error:",
      error
    );

    return {

      success: false,

      error: error

    };

  }

}