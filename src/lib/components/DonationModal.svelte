<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, CreditCard, Smartphone, Lock, CheckCircle } from 'lucide-svelte';
  import { initiateMpesaPayment, simulateMpesaPayment, validatePhoneNumber, formatAmount } from '$lib/mpesa';
  import type { Project } from '$lib/supabase';
  
  export let project: Project;
  
  const dispatch = createEventDispatcher();
  
  // Form state
  let selectedAmount = 0;
  let customAmount = '';
  let paymentMethod: 'mpesa' | 'card' = 'mpesa';
  let phoneNumber = '';
  let message = '';
  
  // Card details
  let cardNumber = '';
  let expiryDate = '';
  let cvv = '';
  
  // UI state
  let isProcessing = false;
  let showSuccess = false;
  let errorMessage = '';
  
  // Predefined amounts
  const amounts = [100, 500, 1000, 2500, 5000, 10000];
  
  $: finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
  $: isValidAmount = finalAmount > 0 && finalAmount <= 150000;
  $: isValidPhone = paymentMethod === 'mpesa' ? validatePhoneNumber(phoneNumber) : true;
  $: isValidCard = paymentMethod === 'card' ? 
    cardNumber.length >= 16 && expiryDate.length >= 5 && cvv.length >= 3 : true;
  $: canSubmit = isValidAmount && (paymentMethod === 'mpesa' ? isValidPhone : isValidCard) && !isProcessing;
  
  function selectAmount(amount: number) {
    selectedAmount = amount;
    customAmount = '';
  }
  
  function handleCustomAmount() {
    selectedAmount = 0;
  }
  
  function close() {
    dispatch('close');
  }
  
  function formatCardNumber(value: string) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  
  function formatExpiry(value: string) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  }
  
  async function handleSubmit() {
    if (!canSubmit) return;
    
    isProcessing = true;
    errorMessage = '';
    
    try {
      let result;
      
      if (paymentMethod === 'mpesa') {
        // Use real M-Pesa API
        result = await initiateMpesaPayment({
          phone: phoneNumber,
          amount: finalAmount,
          accountReference: `PROJECT-${project.id}`,
          transactionDesc: `Donation to ${project.name}`
        });
      } else {
        // Simulate card payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = {
          success: Math.random() > 0.1, // 90% success rate
          message: Math.random() > 0.1 ? 'Payment successful' : 'Card payment failed',
          transactionId: 'CC' + Date.now()
        };
      }
      
      if (result.success) {
        showSuccess = true;
        // In real app, update project raised amount in database
      } else {
        errorMessage = result.message || 'Payment failed. Please try again.';
      }
    } catch (error) {
      console.error('Payment error:', error);
      errorMessage = 'An error occurred. Please try again.';
    } finally {
      isProcessing = false;
    }
  }
  
  function handleSuccessClose() {
    showSuccess = false;
    close();
  }
</script>

<!-- Modal Overlay -->
<div class="modal-overlay" on:click={close}>
  <div class="modal-content" on:click|stopPropagation>
    {#if showSuccess}
      <!-- Success State -->
      <div class="text-center py-8">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle class="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
        <p class="text-gray-600 mb-6">
          Your donation of {formatAmount(finalAmount)} has been successfully processed. 
          Your contribution will make a real difference in the community.
        </p>
        <p class="text-sm text-gray-500 mb-6">
          This donation was made anonymously and no personal details were stored.
        </p>
        <button class="btn-primary w-full" on:click={handleSuccessClose}>
          Close
        </button>
      </div>
    {:else}
      <!-- Donation Form -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Support {project.name}</h2>
        <button 
          class="text-gray-400 hover:text-gray-600 transition-colors"
          on:click={close}
        >
          <X class="h-6 w-6" />
        </button>
      </div>
      
      <div class="mb-6">
        <p class="text-gray-600">{project.description}</p>
      </div>
      
      <!-- Amount Selection -->
      <div class="mb-6">
        <label class="form-label">Donation Amount (KES)</label>
        <div class="grid grid-cols-3 gap-3 mb-4">
          {#each amounts as amount}
            <button
              type="button"
              class="p-3 border rounded-lg text-center font-medium transition-all"
              class:bg-primary-600={selectedAmount === amount}
              class:text-white={selectedAmount === amount}
              class:border-primary-600={selectedAmount === amount}
              class:hover:border-primary-300={selectedAmount !== amount}
              on:click={() => selectAmount(amount)}
            >
              {amount.toLocaleString()}
            </button>
          {/each}
        </div>
        <input
          type="number"
          placeholder="Or enter custom amount"
          class="form-input"
          bind:value={customAmount}
          on:input={handleCustomAmount}
          min="1"
          max="150000"
        />
        {#if finalAmount > 0}
          <p class="text-sm text-gray-600 mt-2">
            Total: {formatAmount(finalAmount)}
          </p>
        {/if}
      </div>
      
      <!-- Payment Method -->
      <div class="mb-6">
        <label class="form-label">Payment Method</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="p-4 border rounded-lg flex items-center justify-center space-x-2 transition-all"
            class:bg-primary-600={paymentMethod === 'mpesa'}
            class:text-white={paymentMethod === 'mpesa'}
            class:border-primary-600={paymentMethod === 'mpesa'}
            on:click={() => paymentMethod = 'mpesa'}
          >
            <Smartphone class="h-5 w-5" />
            <span>M-Pesa</span>
          </button>
          <button
            type="button"
            class="p-4 border rounded-lg flex items-center justify-center space-x-2 transition-all"
            class:bg-primary-600={paymentMethod === 'card'}
            class:text-white={paymentMethod === 'card'}
            class:border-primary-600={paymentMethod === 'card'}
            on:click={() => paymentMethod = 'card'}
          >
            <CreditCard class="h-5 w-5" />
            <span>Card</span>
          </button>
        </div>
      </div>

      <!-- Payment Details -->
      {#if paymentMethod === 'mpesa'}
        <div class="mb-6">
          <label for="phone" class="form-label">M-Pesa Phone Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g., 0712345678"
            class="form-input"
            bind:value={phoneNumber}
            class:border-red-300={phoneNumber && !isValidPhone}
          />
          {#if phoneNumber && !isValidPhone}
            <p class="text-red-600 text-sm mt-1">Please enter a valid Kenyan phone number</p>
          {/if}
        </div>
      {:else}
        <div class="mb-6 space-y-4">
          <div>
            <label for="cardNumber" class="form-label">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              class="form-input"
              bind:value={cardNumber}
              on:input={(e) => {
                cardNumber = formatCardNumber(e.target.value);
              }}
              maxlength="19"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="expiry" class="form-label">Expiry Date</label>
              <input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                class="form-input"
                bind:value={expiryDate}
                on:input={(e) => {
                  expiryDate = formatExpiry(e.target.value);
                }}
                maxlength="5"
              />
            </div>
            <div>
              <label for="cvv" class="form-label">CVV</label>
              <input
                id="cvv"
                type="text"
                placeholder="123"
                class="form-input"
                bind:value={cvv}
                maxlength="4"
              />
            </div>
          </div>
        </div>
      {/if}

      <!-- Optional Message -->
      <div class="mb-6">
        <label for="message" class="form-label">Optional Message (Anonymous)</label>
        <textarea
          id="message"
          placeholder="Leave an encouraging message for the project team..."
          class="form-input resize-none"
          rows="3"
          bind:value={message}
          maxlength="500"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">
          {message.length}/500 characters
        </p>
      </div>

      <!-- Error Message -->
      {#if errorMessage}
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{errorMessage}</p>
        </div>
      {/if}

      <!-- Submit Button -->
      <button
        type="button"
        class="btn-primary w-full flex items-center justify-center space-x-2"
        class:opacity-50={!canSubmit}
        class:cursor-not-allowed={!canSubmit}
        disabled={!canSubmit}
        on:click={handleSubmit}
      >
        {#if isProcessing}
          <div class="spinner"></div>
          <span>Processing...</span>
        {:else}
          <Lock class="h-5 w-5" />
          <span>Complete Donation</span>
        {/if}
      </button>

      <p class="text-xs text-gray-500 text-center mt-4">
        Your donation is secure and anonymous. No personal information will be stored or shared.
      </p>
    {/if}
  </div>
</div>
