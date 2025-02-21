import itemsData from '../data/itemData.json' assert { type: 'json' };

const defaults = {
    MAX_SLOTS: 20,
    MAX_STACK: 99
};

export default class Inventory {
    #items = new Array(defaults.MAX_SLOTS).fill(null);

    addItem(item, quantity) {
        if (!item || typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Invalid item or quantity');
        }
        // Iteratively add items until all quantity is handled
        while (quantity > 0) {
            // For stackable items, try to add to an existing stack first
            if (item.isStackable) {
                const existingIndex = this.#items.findIndex(
                    i => i && i.item.id === item.id && i.quantity < defaults.MAX_STACK
                );
                // If a stack exists and has space, add to it
                if (existingIndex !== -1) {
                    const spaceAvailable = defaults.MAX_STACK - this.#items[existingIndex].quantity;
                    const quantityToAdd = Math.min(quantity, spaceAvailable);
                    this.#items[existingIndex].quantity += quantityToAdd;
                    quantity -= quantityToAdd;
                    continue;
                }
            }

            // Look for an empty slot
            const emptyIndex = this.#items.findIndex(i => i === null);
            if (emptyIndex === -1) {
                console.error('Inventory is full');
                return;
            }

            if (item.isStackable) {
                // Add a full stack or the remaining quantity if it's less than MAX_STACK
                const stackQuantity = Math.min(quantity, defaults.MAX_STACK);
                this.#items[emptyIndex] = { item, quantity: stackQuantity };
                quantity -= stackQuantity;
            } else {
                // For non-stackable items, add each in a separate slot
                const emptyIndices = [];
                for (let i = 0; i < this.#items.length; i++) {
                    if (this.#items[i] === null) emptyIndices.push(i);
                }
                if (emptyIndices.length < quantity) {
                    console.error('Not enough slots for all non-stackable items');
                    quantity = emptyIndices.length; // Only add as many as possible
                }
                for (let i = 0; i < quantity; i++) {
                    this.#items[emptyIndices[i]] = { item, quantity: 1 };
                }
                quantity = 0;
            }
        }
    }

    removeItemByIndex(index, quantity) {
        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Quantity must be a positive number');
        }
        const slot = this.#items[index];
        if (!slot) return null;
        if (slot.quantity > quantity) {
            const removed = { item: slot.item, quantity };
            slot.quantity -= quantity;
            return removed;
        } else {
            const removed = { item: slot.item, quantity: slot.quantity };
            this.#items[index] = null;
            return removed;
        }
    }

    formattedInventory() {
        // Return a view of the inventory slots that are not empty
        return this.#items
            .map((slot, i) => slot ? { slot: i, item: slot.item.name, quantity: slot.quantity } : null)
            .filter(Boolean);
    }
    removeItemById(itemId, quantity) {
        if (!itemId || typeof quantity !== 'number' || quantity <= 0) {
            return null;
        }

        const total = this.countId(itemId);
        if (total < quantity) {
            return null; // Not enough items, do nothing
        }

        let remaining = quantity;

        // Iterate through all slots to remove the required quantity
        for (let i = 0; i < this.#items.length && remaining > 0; i++) {
            const slot = this.#items[i];
            if (slot && slot.item.id === itemId) {
                const removeAmount = Math.min(remaining, slot.quantity);
                this.removeItemByIndex(i, removeAmount);
                remaining -= removeAmount;
            }
        }

        const item = itemsData[itemId]
        return { item, quantity };
    }


    countId(itemId) {
        // Returns the total quantity of items with the given ID
        if (!itemId) return 0;
        return this.#items.reduce(
            (count, slot) => slot && slot.item.id === itemId ? count + slot.quantity : count,
            0 // Start the count at 0.
        );
    }

    containsId(itemId, minimum = 1) {
        return this.countId(itemId) >= minimum;
    }
}


