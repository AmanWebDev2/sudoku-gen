"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  Github,
  Package,
} from "lucide-react";

// Import the actual sudoku generator package
import { generateSudoku, toPDF } from "../../src/index";

interface SudokuData {
  grid: number[][];
  solution: number[][];
  size: number;
  difficulty: string;
}

export function InteractiveDemo() {
  const [size, setSize] = useState<4 | 6 | 9>(9);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [showSolution, setShowSolution] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<SudokuData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [includeSolution, setIncludeSolution] = useState<boolean>(false);

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  const generateNewPuzzle = (
    newSize?: 4 | 6 | 9,
    newDifficulty?: "easy" | "medium" | "hard"
  ) => {
    try {
      setError(null);
      const puzzleSize = newSize || size;
      const puzzleDifficulty = newDifficulty || difficulty;
      const puzzle = generateSudoku(puzzleSize, puzzleDifficulty);
      setCurrentPuzzle(puzzle);
    } catch (err) {
      setError("Failed to generate puzzle. Please try again.");
      console.error("Generation error:", err);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowSolution(false);
    setTimeout(() => {
      generateNewPuzzle();
      setIsGenerating(false);
    }, 500);
  };

  const handleSizeChange = (newSize: string) => {
    const sizeNum = parseInt(newSize) as 4 | 6 | 9;
    setSize(sizeNum);
    setShowSolution(false);
    setCurrentPuzzle(null); // Clear current puzzle immediately
    setIsGenerating(true);

    // Generate new puzzle with the new size after a brief delay for smooth UI transition
    setTimeout(() => {
      generateNewPuzzle(sizeNum, difficulty);
      setIsGenerating(false);
    }, 300);
  };

  const handleDifficultyChange = (
    newDifficulty: "easy" | "medium" | "hard"
  ) => {
    setDifficulty(newDifficulty);
    setShowSolution(false);
    setCurrentPuzzle(null); // Clear current puzzle immediately
    setIsGenerating(true);

    // Generate new puzzle with the new difficulty after a brief delay for smooth UI transition
    setTimeout(() => {
      generateNewPuzzle(size, newDifficulty);
      setIsGenerating(false);
    }, 300);
  };

  const handleExportPDF = async () => {
    if (!currentPuzzle) return;

    try {
      const title = customTitle.trim()
        ? customTitle
        : `Sudoku ${size}×${size} - ${difficulty}`;

      const pdfBuffer = await toPDF(
        currentPuzzle.grid,
        {
          title,
          theme: "light",
          author: "Sudoku Generator Demo",
          subject: `${size}x${size} Sudoku Puzzle`,
          showSolution: includeSolution,
        },
        currentPuzzle.solution
      );

      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = `sudoku-${size}x${size}-${difficulty}${
        includeSolution ? "-with-solution" : ""
      }.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export PDF. Please try again.");
      console.error("PDF export error:", err);
    }
  };

  const renderGrid = (grid: number[][]) => {
    // Responsive cell sizes - smaller on mobile
    const cellSize =
      size === 4
        ? "w-12 h-12 sm:w-16 sm:h-16"
        : size === 6
        ? "w-10 h-10 sm:w-14 sm:h-14"
        : "w-8 h-8 sm:w-12 sm:h-12";

    // Responsive font sizes
    const fontSize =
      size === 4
        ? "text-lg sm:text-2xl"
        : size === 6
        ? "text-base sm:text-xl"
        : "text-sm sm:text-lg";

    const subgridSize = size === 4 ? 2 : size === 6 ? 2 : 3;

    return (
      <div className="inline-block p-2 sm:p-4 md:p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 max-w-full">
        <div
          className="grid gap-0.5 sm:gap-1 max-w-full overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isGiven =
                !showSolution &&
                currentPuzzle &&
                currentPuzzle.grid[rowIndex][colIndex] !== 0;

              // Determine borders for subgrid visualization
              const rightBorder =
                (colIndex + 1) % subgridSize === 0 && colIndex !== size - 1;
              const bottomBorder =
                (rowIndex + 1) % subgridSize === 0 && rowIndex !== size - 1;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    ${cellSize} ${fontSize} 
                    flex items-center justify-center font-mono font-semibold
                    border border-gray-300 bg-white
                    transition-all duration-200 hover:bg-gray-50
                    ${
                      isGiven
                        ? "text-blue-900 bg-blue-50 font-bold"
                        : showSolution
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-400"
                    }
                    ${rightBorder ? "border-r-2 border-r-gray-600" : ""}
                    ${bottomBorder ? "border-b-2 border-b-gray-600" : ""}
                  `}
                >
                  {cell !== 0 ? cell : ""}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Interactive Demo
          </h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-2 sm:px-4 py-4 lg:py-6">
      <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
        <div className="grid lg:grid-cols-5 gap-4 lg:gap-6 flex-1 min-h-0 mt-10">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-3 lg:space-y-4 order-2 lg:order-1">
            {/* Configuration Card */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Configuration
                </CardTitle>
                <CardDescription className="text-sm">
                  Customize your puzzle settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Custom Title Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="custom-title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Custom Title
                  </Label>
                  <Input
                    id="custom-title"
                    type="text"
                    placeholder="Enter a custom title..."
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500">
                    Optional - Leave empty for default title
                  </p>
                </div>

                {/* Size and Difficulty Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Grid Size
                    </Label>
                    <Select
                      value={size.toString()}
                      onValueChange={handleSizeChange}
                      disabled={isGenerating}
                    >
                      <SelectTrigger className="transition-all duration-200 disabled:opacity-50 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4×4</SelectItem>
                        <SelectItem value="6">6×6</SelectItem>
                        <SelectItem value="9">9×9</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Difficulty
                    </Label>
                    <Select
                      value={difficulty}
                      onValueChange={handleDifficultyChange}
                      disabled={isGenerating}
                    >
                      <SelectTrigger className="transition-all duration-200 disabled:opacity-50 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* PDF Export Options */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Export Options
                  </Label>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <Checkbox
                      id="include-solution"
                      checked={includeSolution}
                      onCheckedChange={(checked) =>
                        setIncludeSolution(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="include-solution"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Include solution in PDF
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !currentPuzzle}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 h-9"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isGenerating ? "animate-spin" : ""
                    }`}
                  />
                  {isGenerating ? "Generating..." : "Generate New"}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSolution(!showSolution)}
                    disabled={!currentPuzzle}
                    className="border-2 hover:bg-gray-50 transition-all duration-200 h-9"
                  >
                    {showSolution ? (
                      <EyeOff className="w-4 h-4 sm:mr-1" />
                    ) : (
                      <Eye className="w-4 h-4 sm:mr-1" />
                    )}
                    <span className="hidden sm:inline">
                      {showSolution ? "Hide Solution" : "Show Solution"}
                    </span>
                    <span className="sm:hidden">
                      {showSolution ? "Hide" : "Show"}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleExportPDF}
                    disabled={!currentPuzzle}
                    className="border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 h-9"
                  >
                    <Download className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">PDF</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Puzzle Display */}
          <div className="lg:col-span-3 order-1 lg:order-2 min-h-0">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex flex-col">
              <CardHeader className="text-center pb-3 flex-shrink-0">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {customTitle.trim() ? customTitle : "Sudoku Puzzle"}
                </CardTitle>
                <CardDescription>
                  {currentPuzzle && (
                    <Badge
                      variant={showSolution ? "default" : "secondary"}
                      className="text-xs px-2 py-1 font-medium"
                    >
                      {showSolution ? "🔍 Solution" : "🧩 Puzzle"} - {size}×
                      {size} {difficulty}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-center flex-1 min-h-0 pb-4 px-2 sm:px-6">
                {currentPuzzle && (
                  <div className="space-y-2 sm:space-y-4 flex flex-col items-center h-full w-full">
                    <div className="transition-all duration-300 hover:scale-[1.01] flex justify-center w-full overflow-x-auto">
                      <div className="flex-shrink-0">
                        {renderGrid(
                          showSolution
                            ? currentPuzzle.solution
                            : currentPuzzle.grid
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                        <code className="font-mono text-blue-600">
                          generateSudoku({size}, '{difficulty}')
                        </code>
                      </p>
                    </div>
                  </div>
                )}

                {!currentPuzzle && !isGenerating && (
                  <div className="text-center py-8">
                    <div className="animate-pulse space-y-3">
                      <div className="text-gray-500 text-base">
                        Loading puzzle...
                      </div>
                      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="text-center py-8">
                    <div className="space-y-4">
                      <div className="text-gray-700 text-lg font-medium">
                        Creating your puzzle...
                      </div>
                      <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Small Footer Links */}
        <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-white/20">
          <a
            href="https://github.com/AmanWebDev2/sudoku-gen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.npmjs.com/package/@amanwebdev/sudoku-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
          >
            <Package className="w-4 h-4" />
            <span>NPM</span>
          </a>
        </div>
      </div>
    </section>
  );
}
