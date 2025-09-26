import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { BookOpen, Brain, Download, Copy, RefreshCw, Play, Pause, Eye } from 'lucide-react';

interface GeneratedStory {
  id: string;
  title: string;
  genre: string;
  content: string;
  characters: string[];
  setting: string;
  mood: string;
  wordCount: number;
  readingTime: string;
}

export default function StoryGeneration() {
  const [formData, setFormData] = useState({
    genre: '',
    setting: '',
    mood: '',
    characters: '',
    plot: '',
    length: [1500],
    style: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [isReading, setIsReading] = useState(false);

  const genres = [
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Historical Fiction',
    'Horror',
    'Adventure',
    'Drama',
    'Comedy'
  ];

  const moods = [
    'Dark and Mysterious',
    'Light and Humorous',
    'Romantic and Dreamy',
    'Suspenseful and Tense',
    'Melancholic and Reflective',
    'Exciting and Fast-paced',
    'Peaceful and Serene',
    'Dramatic and Intense'
  ];

  const styles = [
    'First Person',
    'Third Person Limited',
    'Third Person Omniscient',
    'Epistolary (Letters/Diary)',
    'Stream of Consciousness',
    'Minimalist',
    'Descriptive and Rich',
    'Dialogue Heavy'
  ];

  const generateStory = async () => {
    if (!formData.genre) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation process
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 300);

    // Simulate API call delay
    setTimeout(() => {
      const story: GeneratedStory = {
        id: Date.now().toString(),
        title: generateStoryTitle(),
        genre: formData.genre,
        content: generateStoryContent(),
        characters: formData.characters.split(',').map(c => c.trim()).filter(c => c) || ['Alex', 'Morgan', 'Sam'],
        setting: formData.setting || 'A bustling metropolis in the near future',
        mood: formData.mood || 'Mysterious and intriguing',
        wordCount: formData.length[0],
        readingTime: Math.ceil(formData.length[0] / 200) + ' min read'
      };

      setGeneratedStory(story);
      setIsGenerating(false);
      setGenerationProgress(0);
    }, 4000);
  };

  const generateStoryTitle = (): string => {
    const titles = [
      'The Last Echo',
      'Shadows of Tomorrow',
      'The Forgotten Key',
      'Beyond the Horizon',
      'The Silent Guardian',
      'Echoes in Time',
      'The Crimson Dawn',
      'Whispers in the Dark',
      'The Shattered Mirror',
      'Journey to the Unknown'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const generateStoryContent = (): string => {
    return `The rain fell steadily against the window as Alex stared out into the darkening street. Something was different tonight – the usual sounds of the city seemed muted, as if the world itself was holding its breath.

A soft knock at the door interrupted the silence. Alex hesitated before opening it to find Morgan standing in the hallway, soaked from the rain and clutching a mysterious envelope.

"You need to see this," Morgan whispered urgently, glancing over their shoulder. "It changes everything we thought we knew."

The envelope contained a single photograph and a handwritten note that would set in motion a chain of events neither of them could have imagined. As Alex studied the image, the pieces of a long-forgotten puzzle began to fall into place.

The story unfolds as our characters embark on a journey that will test their courage, challenge their beliefs, and ultimately reveal truths that have been hidden for decades. Through twists and turns, revelations and setbacks, they discover that some secrets are worth protecting, while others must be brought to light.

As the mystery deepens and the stakes grow higher, Alex and Morgan must decide who they can trust and how far they're willing to go to uncover the truth. The path ahead is uncertain, but one thing is clear – there's no turning back now.

[This is a sample of the generated story. The full story would continue with rich character development, plot advancement, and a satisfying conclusion that ties together all the elements you specified.]`;
  };

  const startReading = () => {
    if (!generatedStory) return;
    setIsReading(true);
    
    // Simulate text-to-speech functionality
    setTimeout(() => {
      setIsReading(false);
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadStory = () => {
    if (!generatedStory) return;
    
    const content = `${generatedStory.title}

Genre: ${generatedStory.genre}
Setting: ${generatedStory.setting}
Mood: ${generatedStory.mood}
Characters: ${generatedStory.characters.join(', ')}
Word Count: ${generatedStory.wordCount}
Reading Time: ${generatedStory.readingTime}

---

${generatedStory.content}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedStory.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl">Story Generation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-6">Create Your Story</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Genre</label>
              <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2">Setting</label>
              <Input
                placeholder="e.g., Victorian London, Space station, Modern city..."
                value={formData.setting}
                onChange={(e) => setFormData(prev => ({ ...prev, setting: e.target.value }))}
              />
            </div>

            <div>
              <label className="block mb-2">Mood/Tone</label>
              <Select value={formData.mood} onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map(mood => (
                    <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2">Main Characters (comma-separated)</label>
              <Input
                placeholder="e.g., Sarah, Detective Johnson, The mysterious stranger..."
                value={formData.characters}
                onChange={(e) => setFormData(prev => ({ ...prev, characters: e.target.value }))}
              />
            </div>

            <div>
              <label className="block mb-2">Plot Elements/Themes</label>
              <Textarea
                placeholder="Describe key plot points, themes, or elements you want in the story..."
                value={formData.plot}
                onChange={(e) => setFormData(prev => ({ ...prev, plot: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-2">Story Length: {formData.length[0]} words</label>
              <Slider
                value={formData.length}
                onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}
                max={5000}
                min={500}
                step={250}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Short (500)</span>
                <span>Medium (2500)</span>
                <span>Long (5000)</span>
              </div>
            </div>

            <div>
              <label className="block mb-2">Writing Style</label>
              <Select value={formData.style} onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(style => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateStory}
              disabled={!formData.genre || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Generating Story...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Story
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI Writing Progress</span>
                  <span>{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} />
                <p className="text-xs text-muted-foreground">
                  {generationProgress < 30 && "Analyzing story parameters..."}
                  {generationProgress >= 30 && generationProgress < 60 && "Creating characters and setting..."}
                  {generationProgress >= 60 && generationProgress < 90 && "Writing story content..."}
                  {generationProgress >= 90 && "Finalizing and polishing..."}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          {generatedStory ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3>{generatedStory.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{generatedStory.genre}</Badge>
                    <Badge variant="outline">{generatedStory.readingTime}</Badge>
                    <Badge variant="outline">{generatedStory.wordCount} words</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedStory.content)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={downloadStory}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={generateStory}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="mb-2">Story Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Setting:</span> {generatedStory.setting}</p>
                  <p><span className="text-muted-foreground">Mood:</span> {generatedStory.mood}</p>
                  <p><span className="text-muted-foreground">Characters:</span> {generatedStory.characters.join(', ')}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4>Story Content</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={startReading}
                    disabled={isReading}
                  >
                    {isReading ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Reading...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Read Aloud
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {generatedStory.content}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button className="flex-1">
                  Continue Writing
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="mb-2">No Story Generated</h4>
              <p className="text-muted-foreground text-sm">
                Fill out the form and click "Generate Story" to create an AI-powered story based on your preferences.
              </p>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Story Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'The Last Echo', genre: 'Science Fiction', length: '2,100 words', date: '2 hours ago' },
            { title: 'Midnight Garden', genre: 'Fantasy', length: '1,800 words', date: '1 day ago' },
            { title: 'The Detective\'s Dilemma', genre: 'Mystery', length: '3,200 words', date: '3 days ago' },
            { title: 'Love in the Library', genre: 'Romance', length: '1,500 words', date: '1 week ago' },
          ].map((item, index) => (
            <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <h4 className="text-sm">{item.title}</h4>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">{item.genre}</Badge>
                  <Badge variant="outline" className="text-xs">{item.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}