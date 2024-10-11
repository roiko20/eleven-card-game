import Card from './Card';

export interface DropAreaProps {
    numImages?: number;
}

export default function DropArea({numImages}: DropAreaProps) {
    return (
        <Card dropArea={true} numImages={numImages} index={-1}/>
      );
}
