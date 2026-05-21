'use client';

/**
 * Component Showcase Page
 *
 * Demonstrates all available UI components and their variants.
 * Useful for development, testing, and design review.
 */

import { Button, Card, IconButton, TextArea, Divider, Surface, Tooltip } from '@/components/ui';
import { LogoMark, HomeIcon, SearchIcon, NotificationIcon } from '@/components/icons';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Component Showcase
          </h1>
          <p className="text-text-secondary">
            All available UI components and their variants
          </p>
        </div>

        <Divider />

        {/* Colors */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Design Tokens - Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Background" color="var(--background)" />
            <ColorSwatch name="Surface" color="var(--surface)" />
            <ColorSwatch name="Border" color="var(--border)" />
            <ColorSwatch name="Text Primary" color="var(--text-primary)" />
            <ColorSwatch name="Text Secondary" color="var(--text-secondary)" />
            <ColorSwatch name="Accent Main" color="var(--accent-main)" />
            <ColorSwatch name="Accent Dark" color="var(--accent-dark)" />
            <ColorSwatch name="Accent Light" color="var(--accent-light)" />
          </div>
        </section>

        <Divider />

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Buttons
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" size="sm">Small Primary</Button>
              <Button variant="primary" size="md">Medium Primary</Button>
              <Button variant="primary" size="lg">Large Primary</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="secondary" size="sm">Small Secondary</Button>
              <Button variant="secondary" size="md">Medium Secondary</Button>
              <Button variant="secondary" size="lg">Large Secondary</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="ghost" size="sm">Small Ghost</Button>
              <Button variant="ghost" size="md">Medium Ghost</Button>
              <Button variant="ghost" size="lg">Large Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>
        </section>

        <Divider />

        {/* Icon Buttons */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Icon Buttons
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <IconButton icon={HomeIcon} label="Home" size="sm" />
            <IconButton icon={SearchIcon} label="Search" size="md" />
            <IconButton icon={NotificationIcon} label="Notifications" size="lg" />
            <IconButton icon={HomeIcon} label="Home Default" variant="default" />
            <IconButton icon={HomeIcon} label="Home Ghost" variant="ghost" />
          </div>
        </section>

        <Divider />

        {/* Tooltips */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Tooltips
          </h2>
          <div className="flex flex-wrap gap-12 items-center justify-center p-12">
            <Tooltip text="Tooltip on left" position="left" gap={8}>
              <Button variant="secondary">Hover me (left)</Button>
            </Tooltip>
            <Tooltip text="Tooltip on top" position="top" gap={8}>
              <Button variant="secondary">Hover me (top)</Button>
            </Tooltip>
            <Tooltip text="Tooltip on right" position="right" gap={8}>
              <Button variant="secondary">Hover me (right)</Button>
            </Tooltip>
            <Tooltip text="Tooltip on bottom" position="bottom" gap={8}>
              <Button variant="secondary">Hover me (bottom)</Button>
            </Tooltip>
          </div>
          <div className="mt-8 p-6 bg-surface border border-border rounded-lg">
            <h3 className="font-semibold text-text-primary mb-3">Sidebar Icon Tooltips</h3>
            <p className="text-sm text-text-secondary mb-4">
              Navigation icons use right-pointing tooltips with 8px gap
            </p>
            <div className="flex gap-4">
              <Tooltip text="Home" position="right" gap={8}>
                <button className="w-10 h-10 rounded-lg bg-selected text-text-primary flex items-center justify-center">
                  <HomeIcon size={20} />
                </button>
              </Tooltip>
              <Tooltip text="Search" position="right" gap={8}>
                <button className="w-10 h-10 rounded-lg hover:bg-hover text-text-secondary flex items-center justify-center">
                  <SearchIcon size={20} />
                </button>
              </Tooltip>
              <Tooltip text="Notifications" position="right" gap={8}>
                <button className="w-10 h-10 rounded-lg hover:bg-hover text-text-secondary flex items-center justify-center">
                  <NotificationIcon size={20} />
                </button>
              </Tooltip>
            </div>
          </div>
        </section>

        <Divider />

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Cards
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-2">Static Card</h3>
              <p className="text-text-secondary text-sm">
                A basic card without hover effects.
              </p>
            </Card>
            <Card hover className="p-6">
              <h3 className="font-semibold text-text-primary mb-2">Hover Card</h3>
              <p className="text-text-secondary text-sm">
                This card has hover effects - try hovering over it.
              </p>
            </Card>
          </div>
        </section>

        <Divider />

        {/* TextArea */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            TextArea
          </h2>
          <div className="space-y-4">
            <TextArea
              label="Message"
              placeholder="Type your message here..."
              rows={4}
            />
            <TextArea
              label="With Error"
              placeholder="This field has an error"
              error="This field is required"
              rows={3}
            />
          </div>
        </section>

        <Divider />

        {/* Surface */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Surface
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Surface padding="md">
              <h3 className="font-semibold text-text-primary mb-2">
                With Border
              </h3>
              <p className="text-text-secondary text-sm">
                Default surface with border and padding.
              </p>
            </Surface>
            <Surface bordered={false} padding="lg">
              <h3 className="font-semibold text-text-primary mb-2">
                Without Border
              </h3>
              <p className="text-text-secondary text-sm">
                Surface without border but with large padding.
              </p>
            </Surface>
          </div>
        </section>

        <Divider />

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Custom Icons
          </h2>
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <LogoMark size={48} color="var(--accent-main)" />
              <p className="text-xs text-text-secondary mt-2">Logo Mark</p>
            </div>
            <div className="text-center">
              <LogoMark size={64} color="var(--text-primary)" />
              <p className="text-xs text-text-secondary mt-2">Large</p>
            </div>
            <div className="text-center">
              <LogoMark size={32} color="var(--accent-dark)" />
              <p className="text-xs text-text-secondary mt-2">Small</p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Typography
          </h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-text-primary">
                Heading 1
              </h1>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-text-primary">
                Heading 2
              </h2>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-text-primary">
                Heading 3
              </h3>
            </div>
            <div>
              <p className="text-base text-text-primary">
                Body text - primary color
              </p>
            </div>
            <div>
              <p className="text-base text-text-secondary">
                Body text - secondary color
              </p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">
                Small text - tertiary color
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8">
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ name, color }: { name: string; color: string }) {
  return (
    <div className="text-center">
      <div
        className="w-full h-20 rounded-lg border border-border mb-2"
        style={{ backgroundColor: color }}
      />
      <p className="text-xs text-text-secondary">{name}</p>
    </div>
  );
}
