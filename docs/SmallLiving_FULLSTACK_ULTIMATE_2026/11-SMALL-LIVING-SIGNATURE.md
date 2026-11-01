# 11 — SIGNATURE SMALL LIVING FEATURES (DIFFERENTIATION)

## 1. Room Profile — P1
User enters room name/type, width/depth/height and **free placement area** in mm (room outer size is not free usable area), rental/no-drill condition, target budget DEMO, color/material preference, saved spaces; choose active room. Use realistic validation and presets marked illustrations (`Studio 12m²`, `Góc bếp 120cm`, `Bàn làm việc 90cm`). Persist per owner and test RLS. Do not collect home address.

## 2. SpaceFit deterministic rules — P1
Calculate using variant dimensions and orientation (when rotation allowed), available width/depth/height, optional explicitly disclosed clearance and no-drill flag. Never assert actual safety certification or perfect physical fit based on dimensions alone. Return `FIT / MAY_FIT / DOES_NOT_FIT / INSUFFICIENT_DATA` with explanation and measured values, not opaque AI score or invented "98% phù hợp". Every stage pure-function tested: 900→850mm change, rotation, missing heights, mm/cm conversion, room occupancy, no-drill conflicts and boundary equality.

## 3. Solution Bundle Builder — P1
Goals `Bếp gọn`, `Góc làm việc`, `Lưu trữ dưới giường`, `Giặt phơi`, `Phòng thuê không khoan`; select products and variants/qty, show DEMO total, fit warnings and constraints, save/edit/duplicate/delete owned solution, add eligible items to cart. Admin publishes curated starter templates, User clones them. This is a functioning workflow with DB persistence; not cards hardcoded as fixed solutions.

## 4. Shop the Room — P2
An editorial interior photo licensed for use has annotated product hotspots **only if exact listed products or honest "sản phẩm cùng loại" labels are available**. Clicking hotspot opens actual catalog SKU or detail panel; selected items can go to bundle/cart. Admin hotspot builder stores normalized x/y coordinates and link; responsive placement checked on image crops.

## 5. 2D Room Planner — P2 foundation for 3D
Scaled top-down room grid, unit readouts, products as dimensioned footprints, drag, 90-degree rotate, snap to grid optional, collision and out-of-bounds detection, undo/redo if feasible, select/move/delete, save/load same user. All 2D data stored in shared canonical scene model (`room_mm`, `object_id`, `product_variant_id`, `x_mm`, `z_mm`, `rotation_deg`...). Must be reproducible in 3D without separate conflicting databases.

## 6. 3D Room Planner — P3 advanced required in final target
See `12-3D-MOTION-EXPERIENCE.md`. Drag/rotate objects or edit via accessible side panel; choose interior from licensed GLB assets, camera orbit/top-down, dimensions annotated, placement constraints shared with 2D, save/restore DB scene. Mobile fallback accessible. Only complete when functional.

## Must-pass cross-product tests
Room narrower -> fit result changes with reason; toggling `không khoan` -> drilling-only SKU loses compatible status; add/remove bundle item -> demo total updates; Admin publishes room template -> User sees and can clone; save layout -> reload restores both 2D and 3D; collision -> warn and disallow invalid commit or explain exact exception. Unauthorized account cannot inspect another user's saved rooms.
