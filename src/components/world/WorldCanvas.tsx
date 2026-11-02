"use client";

import React, { useEffect, useRef, useState } from "react";
import { SceneManager, ProjectedAnchor } from "./SceneManager";
import { useGame } from "@/context/GameContext";
import { LOCATIONS, CHARACTERS } from "@/data/scenarios";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, MapPin, MessageCircle } from "lucide-react";

export const WorldCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const [anchors, setAnchors] = useState<ProjectedAnchor[]>([]);

  const {
    saveState,
    gameMode,
    activeConversation,
    nearNpc,
    setNearNpc,
    setPlayerCoords,
    startConversation,
    roleplayScene,
  } = useGame();

  // Initialize SceneManager
  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new SceneManager(containerRef.current, saveState.currentDay);
    sceneManagerRef.current = manager;

    manager.setCallbacks(
      (npc) => setNearNpc(npc),
      (projected) => setAnchors(projected),
      (coords, rot) => setPlayerCoords(coords, rot)
    );

    // Initial player coords
    manager.teleportPlayer(saveState.playerCoords[0], saveState.playerCoords[2]);

    return () => {
      manager.destroy();
      sceneManagerRef.current = null;
    };
  }, []);

  // Update camera mode when conversation starts or ends
  useEffect(() => {
    if (!sceneManagerRef.current) return;
    if (gameMode === "conversation" && activeConversation) {
      const char = CHARACTERS.find((c) => c.id === activeConversation.npcId) || nearNpc;
      sceneManagerRef.current.setCameraMode("conversation", char);
    } else {
      sceneManagerRef.current.setCameraMode("follow");
    }
  }, [gameMode, activeConversation, nearNpc]);

  useEffect(() => {
    const manager = sceneManagerRef.current;
    if (!manager) return;
    if (roleplayScene) {
      manager.setDayLighting(roleplayScene.day);
      const location = LOCATIONS.find((item) => item.id === roleplayScene.locationId);
      const npc = CHARACTERS.find((item) => item.locationId === roleplayScene.locationId);
      if (npc) {
        manager.teleportPlayer(npc.coords[0] + 2.8, npc.coords[2] + 2.8);
      } else if (location) {
        manager.teleportPlayer(location.coords[0] + 3, location.coords[2] + 3);
      }
      manager.setCameraMode("follow");
      return;
    }

    manager.setDayLighting(saveState.currentDay);
    manager.teleportPlayer(saveState.playerCoords[0], saveState.playerCoords[2]);
  }, [roleplayScene]);

  // Update lighting and player position on day change
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setDayLighting(saveState.currentDay);
      sceneManagerRef.current.teleportPlayer(saveState.playerCoords[0], saveState.playerCoords[2]);
    }
  }, [saveState.currentDay]);

  // Keyboard shortcut [E] to talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e" && nearNpc && gameMode === "world") {
        e.preventDefault();
        startConversation(nearNpc.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nearNpc, gameMode, startConversation]);

  // Find target destination location for current day beacon
  const currentScenario = saveState.scenarios[saveState.currentDay];
  const targetLocation = LOCATIONS.find((l) => l.id === currentScenario?.targetLocation);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {gameMode === "world" && (
        <div
          className="absolute bottom-24 left-3 z-10 grid grid-cols-3 gap-1 sm:hidden"
          aria-label="Touch movement controls"
        >
          {[
            { dx: -1, dz: 0, Icon: ArrowLeft, label: "Move left", cell: "col-start-1 row-start-2" },
            { dx: 0, dz: -1, Icon: ArrowUp, label: "Move up", cell: "col-start-2 row-start-1" },
            { dx: 1, dz: 0, Icon: ArrowRight, label: "Move right", cell: "col-start-3 row-start-2" },
            { dx: 0, dz: 1, Icon: ArrowDown, label: "Move down", cell: "col-start-2 row-start-3" },
          ].map(({ dx, dz, Icon, label, cell }) => (
            <button
              key={label}
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                sceneManagerRef.current?.setDirectionalInput(label, dx, dz, true);
              }}
              onPointerUp={() => sceneManagerRef.current?.setDirectionalInput(label, dx, dz, false)}
              onPointerLeave={() => sceneManagerRef.current?.setDirectionalInput(label, dx, dz, false)}
              onPointerCancel={() => sceneManagerRef.current?.setDirectionalInput(label, dx, dz, false)}
              onClick={(event) => {
                if (event.detail === 0) sceneManagerRef.current?.movePlayerBy(dx, dz);
              }}
              className={`${cell} flex h-11 w-11 touch-none items-center justify-center rounded-full border border-line bg-paper/85 text-ink shadow-md backdrop-blur-sm active:scale-95`}
              aria-label={label}
            >
              <Icon size={19} />
            </button>
          ))}
          <div className="col-start-2 row-start-2 m-auto h-2.5 w-2.5 rounded-full bg-coral/60" />
        </div>
      )}

      {/* World Projected HTML Anchors Layer (pointer-events-none layer, individual chips pointer-events-auto) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {gameMode === "world" &&
          anchors.map((anchor) => {
            const isNear = nearNpc?.id === anchor.id;
            return (
              <div
                key={anchor.id}
                style={{
                  transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0) translateX(-50%)`,
                  left: 0,
                  top: -45,
                }}
                className="absolute flex flex-col items-center gap-1 transition-transform duration-75"
              >
                {/* NameTag */}
                <div className={`px-2.5 py-1 rounded-full paper-glass text-xs font-semibold text-ink flex items-center gap-1.5 shadow-sm whitespace-nowrap ${anchor.offscreen ? "border border-lagoon/40" : ""}`}>
                  {anchor.offscreen ? (
                    <MapPin size={12} className="text-lagoon shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-coral inline-block" />
                  )}
                  <span>{anchor.name}</span>
                  {anchor.role && (
                    <span className="text-muted font-normal">· {anchor.role.split("&")[0]}</span>
                  )}
                  {anchor.offscreen && <span className="text-[10px] text-lagoon">{anchor.distance}m</span>}
                </div>

                {/* InteractPrompt if near */}
                {isNear && (
                  <button
                    onClick={() => startConversation(anchor.id)}
                    className="pointer-events-auto mt-1 px-3 py-1.5 rounded-full bg-coral text-paper text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-colors flex items-center gap-1.5"
                    aria-label={`Talk to ${anchor.name}`}
                  >
                    <span className="w-4 h-4 rounded bg-paper/20 flex items-center justify-center text-[10px] font-mono">
                      E
                    </span>
                    <MessageCircle size={13} />
                    <span>Talk to {anchor.name.split(" ")[0]}</span>
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
