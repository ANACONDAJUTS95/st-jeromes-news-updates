# QA Audit: The Scholarly Archive
**Project:** St. Jerome's News Updates
**Status:** ⚠️ Aesthetic Alignment Required

## 1. Aesthetic Integrity (Design System vs. Code)

| Feature | Design System Requirement | Current Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Separation** | No 1px lines; Use tonal shifts/whitespace | Using `border-white/10` and `h-[1px]` dividers | ❌ Fail |
| **Shadows** | Brown-tinted `rgba(89, 33, 0, 0.08)` | Standard grey `shadow-xl` | ❌ Fail |
| **Masthead** | Date + Weather in `label-sm` Inter | Date only; `label-md` | ⚠️ Partial |
| **Glassmorphism** | 80% opacity + 24px blur | `backdrop-blur-md` (8px) | ⚠️ Partial |
| **Rounding** | Standard `sm` (0.125rem); Max `xl` | Mix of `sm`, `lg`, and `2xl` | ⚠️ Partial |

## 2. Recommended Improvements

### **High Priority (Aesthetic Correction)**
1.  **Enforce the No-Line Rule**:
    *   Remove `border-white/10` from `Latest Dispatches` cards. Use a tonal shift to `surface-container-low` on hover instead.
    *   Remove the `h-[1px]` divider in the dispatched news items. Replace with 32px-48px of vertical padding.
2.  **Shadow Migration**:
    *   Update `globals.css` to apply `--shadow-academic` to all "Lead Editorial" and interactive cards.
3.  **Masthead Polish**:
    *   Add a mock weather indicator (e.g., "12°C Overcast") next to the date to fulfill the newspaper masthead requirement.
    *   Increase `backdrop-blur` from `md` to `[24px]`.

### **UX & Responsiveness**
1.  **Mobile Grid Pacing**: On viewports < 768px, the "Latest Dispatches" cards feel slightly cramped with `p-10`. Reduce to `p-6` for mobile to give the text more hierarchy.
2.  **Touch Targets**: The "Archive/News/Spotlight" links in the header are a bit close for mobile thumbs. Add `py-2` to their hitboxes.

## 3. Next Steps
I am ready to apply these fixes. Should I start with the **No-Line Rule** cleanup or the **Masthead/Shadow** refinements first?
