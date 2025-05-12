// src/utils/textProcessing.js

/**
 * Find distinct indentation levels in the document
 */
export const findIndentationClusters = (positions, threshold = 20) => {
    const clusters = [];
    positions.forEach(pos => {
      const existingCluster = clusters.find(c => Math.abs(c - pos) < threshold);
      if (existingCluster) {
        const idx = clusters.indexOf(existingCluster);
        clusters[idx] = (existingCluster + pos) / 2;
      } else {
        clusters.push(pos);
      }
    });
    return clusters.sort((a, b) => a - b);
  };
  
  /**
   * Check if line appears to be a heading based on various criteria
   */
  const isHeadingLine = (line, index, allLines) => {
    // Check for vertical spacing
    const hasLargeGap = index > 0 && 
      (line.bbox[1] - allLines[index - 1].bbox[1] > 30);
    
    // Check for all caps
    const isAllCaps = line.text.toUpperCase() === line.text;
    
    // Check for typical heading patterns
    const headingPatterns = [
      /^Chapter\s+\d+/i,
      /^Part\s+[IVX]+/i,
      /^Section\s+\d+/i,
      /^Appendix\s+[A-Z]/i
    ];
    
    const matchesHeadingPattern = headingPatterns.some(pattern => 
      pattern.test(line.text.trim())
    );
  
    return hasLargeGap || isAllCaps || matchesHeadingPattern;
  };
  
  /**
   * Process text lines to extract structure and metadata
   */
  export const processText = (text_lines) => {
    if (!text_lines?.length) return [];
  
    // Sort by vertical position
    const sortedLines = [...text_lines].sort((a, b) => {
      const aY = a.bbox[1];
      const bY = b.bbox[1];
      return Math.abs(aY - bY) < 10 ? a.bbox[0] - b.bbox[0] : aY - bY;
    });
  
    // Find indentation patterns
    const xPositions = sortedLines.map(line => line.bbox[0]);
    const indentationLevels = findIndentationClusters(xPositions);
  
    // Process each line
    let processedLines = sortedLines.map((line, index) => {
      const text = line.text.trim();
      
      // Determine indentation level
      const indentLevel = indentationLevels.findIndex(level => 
        Math.abs(level - line.bbox[0]) < 20
      );
      
      // Extract page numbers
      const pageNumberMatch = text.match(/(\d+)$/);
      const pageNumber = pageNumberMatch ? pageNumberMatch[1] : null;
      const textWithoutPage = pageNumber ? 
        text.slice(0, text.lastIndexOf(pageNumber)).trim() : text;
  
      // Extract numbering patterns
      const numberingMatch = textWithoutPage.match(
        /^(?:\d+\.)+\s|^[ivxIVX]+\.?\s|^[A-Za-z]\.?\s|^[-•●]\s/
      );
      const numbering = numberingMatch ? numberingMatch[0] : '';
      const mainText = textWithoutPage.slice(numbering.length).trim();
  
      // Detect if line is a heading
      const isHeading = isHeadingLine(line, index, sortedLines);
  
      return {
        ...line,
        level: indentLevel,
        pageNumber,
        numbering,
        mainText,
        isHeading
      };
    });
  
    // Group items under their headings
    const result = [];
    let currentGroup = null;
  
    processedLines.forEach(line => {
      if (line.isHeading || !currentGroup) {
        if (currentGroup) result.push(currentGroup);
        currentGroup = { heading: line, items: [] };
      } else {
        currentGroup.items.push(line);
      }
    });
    if (currentGroup) result.push(currentGroup);
  
    return result;
  };
  
  /**
   * Validate the structure of the OCR results
   */
  export const validateProcessedText = (results) => {
    if (!results || typeof results !== 'object') {
      throw new Error('Results must be an object');
    }
  
    // Check each file's results
    Object.entries(results).forEach(([filename, pages]) => {
      if (!Array.isArray(pages)) {
        throw new Error(`Pages for ${filename} must be an array`);
      }
  
      pages.forEach((page, pageIndex) => {
        if (!page.text_lines || !Array.isArray(page.text_lines)) {
          throw new Error(`Invalid text_lines in page ${pageIndex} of ${filename}`);
        }
  
        page.text_lines.forEach((line, lineIndex) => {
          if (!line.text || !line.bbox || !Array.isArray(line.bbox) || line.bbox.length !== 4) {
            throw new Error(`Invalid line structure at index ${lineIndex} in page ${pageIndex} of ${filename}`);
          }
        });
      });
    });
  
    return true;
  };