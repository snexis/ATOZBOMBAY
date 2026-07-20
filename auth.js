/* ==========================================
   ATOZ BOMBAY - FULL AUTHENTICATION ENGINE
   ========================================== */
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ==========================================
// ১. প্লেয়ার সেকশন (Player Section)
// ==========================================

// প্লেয়ার লগইন ফাংশন
export async function handlePlayerLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ডাটাবেস থেকে চেক করা সে আসল প্লেয়ার কি না
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists() && snapshot.val().role === "player") {
            console.log("🎮 Player Authenticated Successfully!");
            window.location.href = "player.html"; // প্লেয়ার ড্যাশবোর্ডে পাঠাবে
        } else {
            // যদি অ্যাডমিন আইডি দিয়ে প্লেয়ার প্যানেলে ঢোকার চেষ্টা করে
            await signOut(auth);
            alert("❌ অ্যাক্সেস প্রত্যাখ্যান! প্লেয়ার অ্যাকাউন্ট দিয়ে লগইন করুন।");
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        alert("❌ ভুল প্লেয়ার আইডি অথবা পাসওয়ার্ড!");
    }
}

// প্লেয়ার পেজ প্রোটেকশন লক
export function protectPlayerPage() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "index.html";
        } else {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (!snapshot.exists() || snapshot.val().role !== "player") {
                await signOut(auth);
                window.location.href = "index.html";
            }
        }
    });
}

// প্লেয়ার লগআউট
export async function handlePlayerLogout() {
    await signOut(auth);
    window.location.href = "index.html";
}


// ==========================================
// ২. অ্যাডমিন সেকশন (Admin Section)
// ==========================================

// অ্যাডমিন লগইন ফাংশন
export async function handleAdminLogin(email, password) {
    // এই ট্রাই-ক্যাচ ব্লকটি আপনার অ্যাডমিন HTML-এর অটো-সেটআপ লজিককে সাহায্য করবে
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ডাটাবেস থেকে চেক করা সে আসল অ্যাডমিন কি না
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists() && snapshot.val().role === "admin") {
        console.log("👑 Admin Authenticated Successfully!");
        window.location.href = "admin-dashboard.html"; // সঠিক হলে অ্যাডমিন ড্যাশবোর্ডে পাঠাবে
    } else {
        // যদি প্লেয়ার আইডি দিয়ে অ্যাডমিন প্যানেলে ঢোকার চেষ্টা করে
        await signOut(auth);
        alert("❌ অ্যাক্সেস প্রত্যাখ্যান! আপনি অ্যাডমিন নন।");
        throw new Error("Not an admin");
    }
}

// অ্যাডমিন পেজ প্রোটেকশন লক (আপনার অ্যাডমিন ড্যাশবোর্ড পেজ সুরক্ষিত রাখার জন্য)
export function protectAdminPage() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "admin-login.html"; // লগইন না থাকলে লগইন পেজে পাঠাবে
        } else {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (!snapshot.exists() || snapshot.val().role !== "admin") {
                await signOut(auth);
                window.location.href = "admin-login.html"; // অ্যাডমিন না হলে বের করে দেবে
            }
        }
    });
}
