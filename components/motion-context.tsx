'use client';
import {createContext,useContext} from 'react';
export const MotionContext=createContext(true);
export function useCinematicMotion(){return useContext(MotionContext)}
