// ============================================================================
// Tilemap Renderer
// Creates Pokemon-style backgrounds using tilesets
// ============================================================================

import * as PIXI from 'pixi.js';
import { assetLoader } from './assetLoader';

export interface TilemapConfig {
    width: number; // in tiles
    height: number; // in tiles
    tileSize: number;
    tilesetType: 'outdoor' | 'indoor';
}

export class TilemapRenderer {
    private container: PIXI.Container;
    private config: TilemapConfig;

    constructor(config: TilemapConfig) {
        this.container = new PIXI.Container();
        this.config = config;
    }

    // Simple grass tilemap for outdoor areas
    createGrassTilemap(): PIXI.Container {
        const { width, height, tileSize, tilesetType } = this.config;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = this.createGrassTile(x, y, tileSize);
                if (tile) {
                    tile.x = x * tileSize;
                    tile.y = y * tileSize;
                    this.container.addChild(tile);
                }
            }
        }

        return this.container;
    }

    private createGrassTile(x: number, y: number, tileSize: number): PIXI.Sprite | null {
        // Get grass tile texture from outdoor tileset
        // Assuming grass tiles are at specific coordinates in the tileset
        // You'll need to adjust these based on your actual tileset

        const texture = assetLoader.getTileTexture('outdoor', 0, 0, tileSize, tileSize);

        if (!texture) {
            // Fallback: create simple grass tile
            const graphics = new PIXI.Graphics();
            graphics.rect(0, 0, tileSize, tileSize);

            // Alternate grass colors for variety
            const grassColors = [0x6B8E23, 0x7A9B2F, 0x5A7D1B];
            const colorIndex = (x + y) % grassColors.length;
            graphics.fill(grassColors[colorIndex]);

            const sprite = new PIXI.Sprite();
            sprite.addChild(graphics);
            return sprite;
        }

        return new PIXI.Sprite(texture);
    }

    // Create a path through the grass
    createPath(pathCoords: Array<{ x: number, y: number }>): void {
        const { tileSize } = this.config;

        pathCoords.forEach(coord => {
            // Get path tile from tileset (you'll need to find the right coordinates)
            const texture = assetLoader.getTileTexture('outdoor', 32, 0, tileSize, tileSize);

            if (texture) {
                const pathTile = new PIXI.Sprite(texture);
                pathTile.x = coord.x * tileSize;
                pathTile.y = coord.y * tileSize;
                this.container.addChild(pathTile);
            } else {
                // Fallback: dirt path
                const graphics = new PIXI.Graphics();
                graphics.rect(coord.x * tileSize, coord.y * tileSize, tileSize, tileSize);
                graphics.fill(0x8B7355);
                this.container.addChild(graphics);
            }
        });
    }

    // Add decorative elements (flowers, rocks, etc.)
    addDecoration(x: number, y: number, decorType: 'flower' | 'rock' | 'bush'): void {
        const { tileSize } = this.config;

        // Map decoration types to tileset coordinates
        // You'll need to adjust these based on your tileset
        const decorCoords: Record<typeof decorType, { x: number, y: number }> = {
            flower: { x: 48, y: 0 },
            rock: { x: 64, y: 0 },
            bush: { x: 80, y: 0 },
        };

        const coords = decorCoords[decorType];
        const texture = assetLoader.getTileTexture('outdoor', coords.x, coords.y, tileSize, tileSize);

        if (texture) {
            const decor = new PIXI.Sprite(texture);
            decor.x = x * tileSize;
            decor.y = y * tileSize;
            this.container.addChild(decor);
        }
    }

    getContainer(): PIXI.Container {
        return this.container;
    }
}

// Helper function to create a simple outdoor scene
export function createOutdoorScene(width: number, height: number, tileSize: number = 16): PIXI.Container {
    const tilemap = new TilemapRenderer({
        width: Math.ceil(width / tileSize),
        height: Math.ceil(height / tileSize),
        tileSize,
        tilesetType: 'outdoor',
    });

    const scene = tilemap.createGrassTilemap();

    // Add some decorative elements
    const decorCount = 15;
    const decorTypes: Array<'flower' | 'rock' | 'bush'> = ['flower', 'rock', 'bush'];

    for (let i = 0; i < decorCount; i++) {
        const randX = Math.floor(Math.random() * (width / tileSize));
        const randY = Math.floor(Math.random() * (height / tileSize));
        const decorType = decorTypes[Math.floor(Math.random() * decorTypes.length)];

        tilemap.addDecoration(randX, randY, decorType);
    }

    return scene;
}

// Helper for indoor scenes
export function createIndoorScene(width: number, height: number, tileSize: number = 16): PIXI.Container {
    const container = new PIXI.Container();

    // Create floor
    for (let y = 0; y < Math.ceil(height / tileSize); y++) {
        for (let x = 0; x < Math.ceil(width / tileSize); x++) {
            const texture = assetLoader.getTileTexture('indoor', 0, 0, tileSize, tileSize);

            if (texture) {
                const tile = new PIXI.Sprite(texture);
                tile.x = x * tileSize;
                tile.y = y * tileSize;
                container.addChild(tile);
            } else {
                // Fallback: wooden floor
                const graphics = new PIXI.Graphics();
                graphics.rect(x * tileSize, y * tileSize, tileSize, tileSize);
                const woodColors = [0x8B7355, 0x9B8365];
                graphics.fill(woodColors[(x + y) % 2]);
                container.addChild(graphics);
            }
        }
    }

    return container;
}
