// ============================================================================
// Asset Loader
// Handles loading and caching of game textures and sprites
// ============================================================================

import * as PIXI from 'pixi.js';

export interface GameAssets {
    tilesets: {
        outdoor: PIXI.Texture | null;
        indoor: PIXI.Texture | null;
    };
    characters: {
        main: PIXI.Texture | null;
    };
    objects: {
        book1: PIXI.Texture | null;
        book2: PIXI.Texture | null;
        book3: PIXI.Texture | null;
    };
}

export class AssetLoader {
    private static instance: AssetLoader;
    public assets: GameAssets = {
        tilesets: {
            outdoor: null,
            indoor: null,
        },
        characters: {
            main: null,
        },
        objects: {
            book1: null,
            book2: null,
            book3: null,
        },
    };

    private constructor() { }

    static getInstance(): AssetLoader {
        if (!AssetLoader.instance) {
            AssetLoader.instance = new AssetLoader();
        }
        return AssetLoader.instance;
    }

    async loadAssets(): Promise<void> {
        try {
            // Load tilesets
            const outdoorTexture = await PIXI.Assets.load('/images/tilesets/outdoor.png');
            this.assets.tilesets.outdoor = outdoorTexture;

            const indoorTexture = await PIXI.Assets.load('/images/tilesets/indoor.png');
            this.assets.tilesets.indoor = indoorTexture;

            // Load character sprite
            const mainCharacter = await PIXI.Assets.load('/images/characters/main.png');
            this.assets.characters.main = mainCharacter;

            // Load object sprites - books
            try {
                const book1 = await PIXI.Assets.load('/images/objects/book1.png');
                this.assets.objects.book1 = book1;
            } catch (e) {
                console.log('Book1 not found, using fallback');
            }

            try {
                const book2 = await PIXI.Assets.load('/images/objects/book2.png');
                this.assets.objects.book2 = book2;
            } catch (e) {
                console.log('Book2 not found, using fallback');
            }

            try {
                const book3 = await PIXI.Assets.load('/images/objects/book3.png');
                this.assets.objects.book3 = book3;
            } catch (e) {
                console.log('Book3 not found, using fallback');
            }

            console.log('✅ All assets loaded successfully!');
        } catch (error) {
            console.error('❌ Error loading assets:', error);
            throw error;
        }
    }

    // Helper to get tileset texture by region
    getTileTexture(
        tilesetName: 'outdoor' | 'indoor',
        x: number,
        y: number,
        width: number = 16,
        height: number = 16
    ): PIXI.Texture | null {
        const tileset = this.assets.tilesets[tilesetName];
        if (!tileset) return null;

        return new PIXI.Texture({
            source: tileset.source,
            frame: new PIXI.Rectangle(x, y, width, height),
        });
    }

    // Helper to create animated sprite from sprite sheet
    createAnimatedSprite(
        texture: PIXI.Texture,
        frameWidth: number,
        frameHeight: number,
        frameCount: number
    ): PIXI.AnimatedSprite {
        const frames: PIXI.Texture[] = [];

        for (let i = 0; i < frameCount; i++) {
            const frame = new PIXI.Texture({
                source: texture.source,
                frame: new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight),
            });
            frames.push(frame);
        }

        return new PIXI.AnimatedSprite(frames);
    }
}

// Export singleton instance
export const assetLoader = AssetLoader.getInstance();
