/* ==========================================
   ATOZ BOMBAY - PLAYER AUTHENTICATION ENGINE
   ========================================== */
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// প্লেয়ার লগইন ফাংশন
export async function handlePlayerLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ডাটাবেস থেকে চেক করা সে আসল প্লেয়ার কি না
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists() && snapshot.val().role === "player") {
            console.log("🎮 Player Authenticated Successfully!");
            window.location.href = "player.html"; // সঠিক হলে প্লেয়ার ড্যাশবোর্ডে পাঠাবে
        } else {
            // যদি অ্যাডমিন আইডি দিয়ে প্লেয়ার প্যানেলে ঢোকার চেষ্টা করে
            await signOut(auth);
            alert("❌ অ্যাক্সেс প্রত্যাখ্যান! প্লেয়ার অ্যাকাউন্ট দিয়ে লগইন করুন।");
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        alert("❌ ভুল প্লেয়ার আইডি অথবা পাসওয়ার্ড!");
    }
}

// প্লেয়ার পেজ প্রোটেকশন লক (player.html এর সুরক্ষার জন্য)
export function protectPlayerPage() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "index.html"; // লগইন না থাকলে মেইন গেটে পাঠাবে
        } else {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (!snapshot.exists() || snapshot.val().role !== "player") {
                await signOut(auth);
                window.location.href = "index.html"; // প্লেয়ার না হলে বের করে দেবে
            }
        }
    });
}

// লগআউট ফাংশন
export async function handlePlayerLogout() {
    await signOut(auth);
    window.location.href = "index.html";
}
