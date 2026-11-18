# Security Specification — Nusantara Bahasa Quest

## 1. Data Invariants
1. A `PlayerPresence` document at `/players/{uid}` can only be created, updated, or deleted by the authenticated owner whose `request.auth.uid == uid` and `request.auth.token.email_verified == true`, and must contain zero PII (`email`, `phone`, `address`).
2. `StudentProgress` at `/progress/{uid}` is strictly private to the owner (`request.auth.uid == uid`) or verified teacher admin (`maulanakarim9502@gmail.com` / `maulana9502@gmail.com`).
3. `TeacherArchiveSubmission` at `/archives/{archiveId}` can only be created by the authenticated student matching `uid == request.auth.uid`, is immutable once created (except admin review), and can only be read by the submitting student or verified teacher admin (`maulanakarim9502@gmail.com` / `maulana9502@gmail.com`).
4. All document IDs (`uid`, `archiveId`) must match `^[a-zA-Z0-9_\-]+$` and be `<= 128` characters.
5. Every string field enforces strict `.size()` bounds and numeric counters enforce valid bounds (`chapterId` in `[1, 11]`, `completedCount` in `[0, 11]`).

## 2. Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated read or write on `/players/user1`.
2. Unverified email user attempting to create `/players/user1`.
3. Identity spoofing: User A (`uidA`) creating `/players/uidB` or setting `uid: "uidB"` inside `/players/uidA`.
4. Shadow field injection: Creating `/players/uidA` with extra ghost field `isAdmin: true`.
5. Oversized string DoS: Setting `name` > 60 chars or `school` > 80 chars in `/players/uidA`.
6. Invalid path ID poisoning: Writing `/archives/../../etc/passwd` or ID > 128 chars.
7. Cross-user progress theft: User A reading or updating `/progress/uidB`.
8. Unbounded array attack: Setting `completedChapters` with 100 items in `/progress/uidA`.
9. Timestamp spoofing: Setting `createdAt` or `updatedAt` to a client clock instead of `request.time`.
10. Archive tampering: Student A updating or deleting `/archives/arch1` after creation.
11. Cross-student archive snooping: Student A reading `/archives/archB` belonging to Student B.
12. Email spoofing on admin access: Authenticated user with `email: "maulanakarim9502@gmail.com"` but `email_verified: false` attempting to list all `/archives`.
