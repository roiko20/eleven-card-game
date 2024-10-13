import { createActorContext } from '@xstate/react';
import elevenMachine from '../state/elevenMachine';

export const ElevenMachineContext = createActorContext(elevenMachine);