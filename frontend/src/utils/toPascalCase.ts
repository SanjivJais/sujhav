export function toPascalCase(text: string): string {
    return text
        .toLowerCase()
        .split(/[\s_-]+/) // Split by space, underscore, or hyphen
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}